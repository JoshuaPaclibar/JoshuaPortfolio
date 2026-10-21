import rateLimit from 'express-rate-limit';

/** Limits the contact endpoint to 10 submissions per IP every 15 minutes. */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { success: false, message: 'Too many messages sent. Please try again in a few minutes.' },
});
