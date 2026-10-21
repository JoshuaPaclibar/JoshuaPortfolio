import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateContact, isValidObjectId, cleanText, LIMITS } from '../src/utils/validate.js';

const good = { name: 'Juan Dela Cruz', email: 'Juan@Example.com ', message: 'Hello, I would like to talk about an internship.' };

test('valid contact passes and is normalised', () => {
  const { values, errors } = validateContact(good);
  assert.deepEqual(errors, {});
  assert.equal(values.email, 'juan@example.com');
});

test('missing fields are rejected', () => {
  const { errors } = validateContact({});
  assert.deepEqual(Object.keys(errors).sort(), ['email', 'message', 'name']);
});

test('non-object body is rejected without throwing', () => {
  for (const body of [undefined, null, 'text', 42]) {
    assert.equal(Object.keys(validateContact(body).errors).length, 3);
  }
});

test('bad email formats are rejected', () => {
  for (const email of ['plain', 'a@b', 'a b@c.com', '@x.com']) {
    assert.ok(validateContact({ ...good, email }).errors.email, `should reject ${email}`);
  }
});

test('message length limits are enforced', () => {
  assert.ok(validateContact({ ...good, message: 'short' }).errors.message);
  assert.ok(validateContact({ ...good, message: 'x'.repeat(LIMITS.messageMax + 1) }).errors.message);
  assert.equal(validateContact({ ...good, message: 'x'.repeat(LIMITS.messageMax) }).errors.message, undefined);
});

test('NoSQL operator objects are treated as invalid strings', () => {
  const { errors } = validateContact({ ...good, email: { $gt: '' }, name: { $ne: null } });
  assert.ok(errors.email);
  assert.ok(errors.name);
});

test('control characters are stripped but newlines are kept', () => {
  assert.equal(cleanText('  a\u0000b\nc\u0007  '), 'ab\nc');
});

test('ObjectId validation', () => {
  assert.equal(isValidObjectId('507f1f77bcf86cd799439011'), true);
  assert.equal(isValidObjectId('123'), false);
  assert.equal(isValidObjectId({ $gt: '' }), false);
});
