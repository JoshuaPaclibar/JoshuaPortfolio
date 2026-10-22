// The ONLY place the frontend talks to the backend.
// - `npm run dev`: always uses "/api", which the Vite dev server proxies to the backend
//   (see vite.config.js). A leftover VITE_API_URL in frontend/.env is ignored on purpose.
// - Production build: uses VITE_API_URL (for example https://my-backend.example.com/api).
const API_URL = (import.meta.env.DEV ? '/api' : import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, fieldErrors = {} } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Check that the backend is running and the API URL is correct.');
  }

  // A wrong URL often returns an HTML page; give a clear message instead of "Unexpected token <".
  const isJson = (response.headers.get('content-type') || '').includes('application/json');
  if (!isJson) {
    throw new ApiError(`The server returned an unexpected response (status ${response.status}) from ${API_URL}${path}. Another program may be using the backend's port, or the backend is not the portfolio API.`, {
      status: response.status,
    });
  }

  const body = await response.json();
  if (!response.ok) {
    throw new ApiError(body.message || 'Something went wrong.', {
      status: response.status,
      fieldErrors: body.errors || {},
    });
  }
  return body;
}

/** GET /api/projects → array of projects */
export const getProjects = async () => (await request('/projects')).data;

/** GET /api/projects/:id → one project */
export const getProjectById = async (id) => (await request(`/projects/${encodeURIComponent(id)}`)).data;

/** POST /api/contact → success message */
export const sendContact = async ({ name, email, message }) =>
  (await request('/contact', { method: 'POST', body: JSON.stringify({ name, email, message }) })).message;
