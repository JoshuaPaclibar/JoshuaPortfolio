// Sends the contact form message to your Gmail inbox using nodemailer.
// Setup (see README): set SMTP_USER and SMTP_PASS (a Gmail "App Password") in backend/.env.

// Google shows app passwords as "abcd efgh ijkl mnop". Spaces are removed so pasting it as-is works.
const cleanPass = (value) => String(value || '').replace(/\s+/g, '');

export const isMailConfigured = (env = process.env) => Boolean(env.SMTP_USER && cleanPass(env.SMTP_PASS));

const oneLine = (text) => String(text).replace(/\s+/g, ' ').trim();

/** Builds the email fields. Header values are forced onto one line to prevent header injection. */
export function buildContactEmail({ name, email, message }, env = process.env) {
  const to = env.CONTACT_TO || env.SMTP_USER;
  return {
    from: `"Portfolio Contact Form" <${env.SMTP_USER}>`,
    to,
    replyTo: `"${oneLine(name).replace(/"/g, "'")}" <${email}>`, // pressing Reply answers the visitor
    subject: `Portfolio message from ${oneLine(name)}`.slice(0, 150),
    text: `Name: ${oneLine(name)}\nEmail: ${email}\n\nMessage:\n${message}\n`,
  };
}

async function getTransporter(env, createTransport) {
  if (!createTransport) {
    // Loaded only when needed, so the API still starts if nodemailer is not installed yet.
    const nodemailer = await import('nodemailer');
    createTransport = nodemailer.default.createTransport.bind(nodemailer.default);
  }
  return createTransport({
    service: 'gmail',
    auth: { user: env.SMTP_USER, pass: cleanPass(env.SMTP_PASS) },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

/** Turns a nodemailer error into a short, beginner-friendly hint for the backend terminal. */
export function explainMailError(err) {
  const text = `${err?.code || ''} ${err?.responseCode || ''} ${err?.message || ''}`;
  if (/EAUTH|535|Invalid login|Username and Password not accepted/i.test(text))
    return 'Gmail rejected the login. SMTP_PASS must be a 16-character App Password (not your normal password), and 2-Step Verification must be ON. Create one at https://myaccount.google.com/apppasswords';
  if (/ENOTFOUND|ECONNREFUSED|ETIMEDOUT|ESOCKET|ECONNECTION|EDNS/i.test(text))
    return 'Cannot reach Gmail (smtp.gmail.com). Check your internet connection, firewall or antivirus.';
  if (/Cannot find (package|module) 'nodemailer'/i.test(text))
    return 'nodemailer is not installed. Run "npm install" inside the backend folder.';
  return err?.message || 'Unknown email error.';
}

/**
 * Checks the Gmail login without sending anything. Used once when the backend starts.
 * Returns { ok: true } or { ok: false, reason }.
 */
export async function verifyMail({ env = process.env, createTransport } = {}) {
  if (!isMailConfigured(env)) return { ok: false, reason: 'SMTP_USER / SMTP_PASS are not set in backend/.env.' };
  try {
    const transporter = await getTransporter(env, createTransport);
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: explainMailError(err) };
  }
}

/**
 * Sends the message. `createTransport` can be replaced in tests.
 * Throws if mail is not configured or if sending fails (the caller decides what to tell the visitor).
 */
export async function sendContactEmail(values, { env = process.env, createTransport } = {}) {
  if (!isMailConfigured(env)) throw new Error('Email is not configured (SMTP_USER / SMTP_PASS missing).');
  const transporter = await getTransporter(env, createTransport);
  await transporter.sendMail(buildContactEmail(values, env));
}
