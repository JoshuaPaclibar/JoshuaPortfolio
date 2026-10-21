// Small, dependency-free validation helpers (kept separate so they are easy to unit test).

export const LIMITS = { nameMin: 2, nameMax: 80, emailMax: 254, messageMin: 10, messageMax: 2000 };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const OBJECT_ID_PATTERN = /^[a-f\d]{24}$/i;
// Control characters except tab (\t) and newline (\n).
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u0008\u000B-\u001F\u007F]/g;

export const isValidObjectId = (value) => typeof value === 'string' && OBJECT_ID_PATTERN.test(value);

/** Trim and remove control characters. Returns '' for non-strings (blocks NoSQL operator objects). */
export const cleanText = (value) =>
  typeof value === 'string' ? value.replace(/\r\n/g, '\n').replace(CONTROL_CHARS, '').trim() : '';

/**
 * Validates a contact form body.
 * Returns { values, errors } where errors is an object { field: message } (empty when valid).
 */
export function validateContact(body) {
  const source = body && typeof body === 'object' ? body : {};
  const values = {
    name: cleanText(source.name),
    email: cleanText(source.email).toLowerCase(),
    message: cleanText(source.message),
  };
  const errors = {};

  if (!values.name) errors.name = 'Name is required.';
  else if (values.name.length < LIMITS.nameMin) errors.name = `Name must be at least ${LIMITS.nameMin} characters.`;
  else if (values.name.length > LIMITS.nameMax) errors.name = `Name must be at most ${LIMITS.nameMax} characters.`;

  if (!values.email) errors.email = 'Email is required.';
  else if (values.email.length > LIMITS.emailMax || !EMAIL_PATTERN.test(values.email))
    errors.email = 'Please enter a valid email address.';

  if (!values.message) errors.message = 'Message is required.';
  else if (values.message.length < LIMITS.messageMin)
    errors.message = `Message must be at least ${LIMITS.messageMin} characters.`;
  else if (values.message.length > LIMITS.messageMax)
    errors.message = `Message must be at most ${LIMITS.messageMax} characters.`;

  return { values, errors };
}
