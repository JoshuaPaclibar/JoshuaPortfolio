import Contact from '../models/Contact.js';
import { isDbConnected } from '../config/db.js';
import { validateContact } from '../utils/validate.js';
import { isMailConfigured, sendContactEmail } from '../utils/mailer.js';

// POST /api/contact
// 1. Validate. 2. Email it to the portfolio owner. 3. Also save a copy in MongoDB when connected.
// The visitor only sees "sent" when at least one of those really worked.
export async function createContact(req, res, next) {
  try {
    const { values, errors } = validateContact(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
    }

    let emailed = false;
    let saved = false;

    if (isMailConfigured()) {
      try {
        await sendContactEmail(values);
        emailed = true;
      } catch (err) {
        console.error(`[contact] Email failed: ${err.message}`);
      }
    } else {
      console.warn('[contact] Email is not configured. Set SMTP_USER and SMTP_PASS in backend/.env.');
    }

    if (isDbConnected()) {
      try {
        // Only the three validated fields are saved; anything else in the body is ignored.
        await Contact.create(values);
        saved = true;
      } catch (err) {
        console.error(`[contact] Saving to MongoDB failed: ${err.message}`);
      }
    }

    if (!emailed && !saved) {
      return res.status(503).json({
        success: false,
        message: 'Your message could not be delivered right now. Please try again later or contact me directly.',
      });
    }

    res.status(201).json({ success: true, message: 'Thank you! Your message has been sent.' });
  } catch (err) {
    next(err);
  }
}
