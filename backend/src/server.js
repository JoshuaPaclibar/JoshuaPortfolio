import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
import { isMailConfigured, verifyMail } from './utils/mailer.js';

const PORT = Number(process.env.PORT) || 5050;

const server = app.listen(PORT, () => {
  console.log(`[server] Portfolio API running at http://localhost:${PORT}/api  (check: http://localhost:${PORT}/api/health)`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[server] Port ${PORT} is already in use by another program. Change PORT in backend/.env (for example PORT=5050) and restart.`);
  } else {
    console.error('[server] Failed to start:', err.message);
  }
  process.exit(1);
});

// The API starts even if MongoDB is down; connectDB logs the problem and keeps retrying.
connectDB();

// Check the Gmail login once at startup so mistakes show up here, not when a visitor sends a message.
if (isMailConfigured()) {
  verifyMail().then((result) => {
    if (result.ok) console.log('[mail] Gmail login OK. Contact messages will be emailed.');
    else console.error(`[mail] Email is NOT working: ${result.reason}`);
  });
} else {
  console.warn('[mail] Email is not configured yet. Set SMTP_USER and SMTP_PASS in backend/.env to receive contact messages in Gmail.');
}
