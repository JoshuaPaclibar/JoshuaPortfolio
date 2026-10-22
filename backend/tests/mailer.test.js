import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildContactEmail, isMailConfigured, sendContactEmail } from '../src/utils/mailer.js';

const env = { SMTP_USER: 'me@gmail.com', SMTP_PASS: 'app-password', CONTACT_TO: 'inbox@gmail.com' };
const values = { name: 'Juan\r\nBcc: evil@x.com', email: 'juan@example.com', message: 'Hello there\nsecond line' };

test('mail is configured only when user and password exist', () => {
  assert.equal(isMailConfigured(env), true);
  assert.equal(isMailConfigured({ SMTP_USER: 'a' }), false);
  assert.equal(isMailConfigured({}), false);
});

test('email goes to CONTACT_TO (default SMTP_USER) with reply-to set to the visitor', () => {
  assert.equal(buildContactEmail(values, env).to, 'inbox@gmail.com');
  assert.equal(buildContactEmail(values, { ...env, CONTACT_TO: '' }).to, 'me@gmail.com');
  assert.match(buildContactEmail(values, env).replyTo, /juan@example\.com/);
});

test('header values cannot contain line breaks (no header injection)', () => {
  const mail = buildContactEmail(values, env);
  for (const field of [mail.subject, mail.replyTo, mail.from]) assert.doesNotMatch(field, /[\r\n]/);
  assert.match(mail.text, /second line/);
});

test('sendContactEmail passes Gmail credentials and the message to the transport', async () => {
  let created, sent;
  await sendContactEmail(values, {
    env,
    createTransport: (opts) => ((created = opts), { sendMail: async (m) => (sent = m) }),
  });
  assert.equal(created.service, 'gmail');
  assert.deepEqual(created.auth, { user: 'me@gmail.com', pass: 'app-password' });
  assert.equal(sent.to, 'inbox@gmail.com');
});

test('sendContactEmail throws when not configured or when sending fails', async () => {
  await assert.rejects(sendContactEmail(values, { env: {} }), /not configured/);
  await assert.rejects(
    sendContactEmail(values, { env, createTransport: () => ({ sendMail: async () => { throw new Error('boom'); } }) }),
    /boom/,
  );
});

import { verifyMail, explainMailError } from '../src/utils/mailer.js';

test('app password pasted with spaces is cleaned before login', async () => {
  let created;
  await sendContactEmail(values, {
    env: { ...env, SMTP_PASS: 'abcd efgh ijkl mnop' },
    createTransport: (opts) => ((created = opts), { sendMail: async () => {} }),
  });
  assert.equal(created.auth.pass, 'abcdefghijklmnop');
});

test('verifyMail reports ok, not-configured and Gmail login failures clearly', async () => {
  assert.deepEqual(await verifyMail({ env, createTransport: () => ({ verify: async () => true }) }), { ok: true });
  assert.equal((await verifyMail({ env: {} })).ok, false);
  const bad = await verifyMail({
    env,
    createTransport: () => ({ verify: async () => { throw Object.assign(new Error('Invalid login'), { code: 'EAUTH' }); } }),
  });
  assert.equal(bad.ok, false);
  assert.match(bad.reason, /App Password/);
});

test('explainMailError gives network hints', () => {
  assert.match(explainMailError(Object.assign(new Error('x'), { code: 'ENOTFOUND' })), /internet/);
});
