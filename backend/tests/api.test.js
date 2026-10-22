// API tests run WITHOUT a database: they check routing, validation, 404/503/400 handling and CORS.
// (Saving a message to a live MongoDB needs a running database and is tested manually, see README.)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

process.env.FRONTEND_URL = 'http://localhost:5173';
process.env.NODE_ENV = 'test';

const { default: app } = await import('../src/app.js');

let server;
let base;

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, resolve);
  });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

const post = (path, body, headers = {}) =>
  fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) });

const good = { name: 'Juan Dela Cruz', email: 'juan@example.com', message: 'Hello, I would like to talk about an internship.' };

test('GET /api/health reports ok and database state', async () => {
  const res = await fetch(`${base}/api/health`);
  const json = await res.json();
  assert.equal(res.status, 200);
  assert.equal(json.status, 'ok');
  assert.equal(json.database, 'disconnected');
});

test('unknown route returns JSON 404', async () => {
  const res = await fetch(`${base}/api/nope`);
  assert.equal(res.status, 404);
  assert.equal((await res.json()).success, false);
});

test('GET /api/projects returns 503 when the database is down', async () => {
  const res = await fetch(`${base}/api/projects`);
  assert.equal(res.status, 503);
});

test('POST /api/contact rejects invalid input with 400 and field errors', async () => {
  const res = await post('/api/contact', { name: '', email: 'bad', message: 'hi' });
  const json = await res.json();
  assert.equal(res.status, 400);
  assert.ok(json.errors.name && json.errors.email && json.errors.message);
});

test('POST /api/contact rejects malformed JSON with 400', async () => {
  const res = await post('/api/contact', '{ not json');
  assert.equal(res.status, 400);
  assert.match((await res.json()).message, /JSON/);
});

test('POST /api/contact with valid data returns 503 (not a silent success) when the database is down', async () => {
  const res = await post('/api/contact', good);
  assert.equal(res.status, 503);
  assert.equal((await res.json()).success, false);
});

test('CORS allows the configured frontend origin only', async () => {
  const allowed = await fetch(`${base}/api/health`, { headers: { Origin: 'http://localhost:5173' } });
  assert.equal(allowed.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  const blocked = await fetch(`${base}/api/health`, { headers: { Origin: 'http://evil.example' } });
  assert.equal(blocked.status, 403);
});

test('security headers from Helmet are present', async () => {
  const res = await fetch(`${base}/api/health`);
  assert.ok(res.headers.get('x-content-type-options'));
});

test('POST /api/contact is NOT reported as sent when neither email nor database is available', async () => {
  const res = await post('/api/contact', good);
  assert.equal(res.status, 503);
});

test('CORS: any localhost port is allowed in development, other sites never', async () => {
  const local = await fetch(`${base}/api/health`, { headers: { Origin: 'http://127.0.0.1:5174' } });
  assert.equal(local.status, 200);
  const other = await fetch(`${base}/api/health`, { headers: { Origin: 'https://evil.example' } });
  assert.equal(other.status, 403);
});
