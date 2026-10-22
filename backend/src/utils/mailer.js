// Sends the contact form message to your Gmail inbox using nodemailer.
// Setup (see README): set SMTP_USER and SMTP_PASS (a Gmail "App Password") in backend/.env.

export const isMailConfigured = (env = process.env) => Boolean(env.SMTP_USER && env.SMTP_PASS);

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

/**
 * Sends the message. `createTransport` can be replaced in tests.
 * Throws if mail is not configured or if sending fails (the caller decides what to tell the visitor).
 */
export async function sendContactEmail(values, { env = process.env, createTransport } = {}) {
  if (!isMailConfigured(env)) throw new Error('Email is not configured (SMTP_USER / SMTP_PASS missing).');

  if (!createTransport) {
    // Loaded only when needed, so the API still starts if nodemailer is not installed yet.
    const nodemailer = await import('nodemailer');
    createTransport = nodemailer.default.createTransport.bind(nodemailer.default);
  }

  const transporter = createTransport({
    service: 'gmail',
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  await transporter.sendMail(buildContactEmail(values, env));
}
