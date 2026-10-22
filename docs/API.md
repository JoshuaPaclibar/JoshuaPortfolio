# API Reference

Base URL (development): `http://localhost:5000/api`

All responses are JSON.

- Success: `{ "success": true, ... }`
- Failure: `{ "success": false, "message": "...", "errors": { "field": "..." } }` (`errors` only for validation problems)

| Status | Meaning |
| ------ | ------- |
| 200 | OK |
| 201 | Created (contact message saved) |
| 400 | Invalid input, invalid id, or malformed JSON |
| 403 | Origin not allowed by CORS |
| 404 | Project or route not found |
| 413 | Request body larger than 10 KB |
| 429 | Rate limit exceeded (contact endpoint) |
| 500 | Unexpected server error |
| 503 | MongoDB is not connected (projects) / message could not be delivered (contact) |

---

## GET /api/health

Basic health check. Works even when MongoDB is down.

```json
{ "success": true, "status": "ok", "database": "connected", "uptimeSeconds": 42 }
```

`database` is one of `connected`, `connecting`, `disconnecting`, `disconnected`.

## GET /api/projects

Returns all projects, sorted by `order` then creation date.

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "66f0c0ffee0123456789abcd",
      "title": "Cashier Programming",
      "description": "A personal Java project ...",
      "technologies": ["Java", "Eclipse"],
      "image": "/images/cashier.png",
      "githubUrl": "",
      "liveUrl": "",
      "order": 2,
      "createdAt": "2026-10-21T00:00:00.000Z",
      "updatedAt": "2026-10-21T00:00:00.000Z"
    }
  ]
}
```

Errors: `503` if the database is not connected.

## GET /api/projects/:id

Returns one project (`{ "success": true, "data": { ... } }`).

Errors: `400` if `:id` is not a 24-character hex ObjectId, `404` if no project has that id, `503` if the database is not connected.

## POST /api/contact

Validates a message, **emails it to the portfolio owner** (Gmail, via nodemailer), and also saves a copy to MongoDB (collection `contacts`) when the database is connected.

Request body (`Content-Type: application/json`):

| Field | Rules |
| ----- | ----- |
| `name` | string, 2–80 characters |
| `email` | string, valid email format, max 254 characters (stored lower-case) |
| `message` | string, 10–2000 characters |

Values are trimmed and control characters are removed. Extra fields are ignored. Non-string values are rejected.

Success `201`:

```json
{ "success": true, "message": "Thank you! Your message has been sent." }
```

Validation error `400`:

```json
{
  "success": false,
  "message": "Please fix the highlighted fields.",
  "errors": { "email": "Please enter a valid email address." }
}
```

Other errors: `429` after 10 requests per IP in 15 minutes, `503` if the message could not be delivered by **either** route (email not configured/failed **and** database not connected). It is never reported as sent unless the email was sent or the message was saved.

Invalid input is checked first, so it returns `400` even when nothing else is configured.

### Example (PowerShell)

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:5000/api/contact `
  -ContentType 'application/json' `
  -Body '{"name":"Test User","email":"test@example.com","message":"Hello from PowerShell!"}'
```

---

## Security notes

- CORS only allows the origin set in `FRONTEND_URL` (requests with no `Origin` header, such as curl, are allowed).
- Helmet adds standard security headers.
- JSON bodies are limited to 10 KB.
- Messages are stored as plain text; the React frontend escapes them when displayed.
- There is no admin API or login. View saved messages in MongoDB Compass, Atlas, or `mongosh`.
