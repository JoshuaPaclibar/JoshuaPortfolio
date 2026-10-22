import Contact from '../models/Contact.js';
import { isDbConnected } from '../config/db.js';
import { validateContact } from '../utils/validate.js';
import { isMailConfigured, sendContactEmail, explainMailError } from '../utils/mailer.js';


// POST /api/contact
// 1. Validate.  2. Email it to the portfolio owner (this is what makes it "sent").
// 3. Save a copy in MongoDB when connected (best effort, only a backup).
// The visitor only sees "sent" when the email was really delivered to Gmail.
export async function createContact(req, res, next) {
  try {
    const { values, errors } = validateContact(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
    }

    let emailed = false;
    if (isMailConfigured()) {
      try {
        await sendContactEmail(values);
        emailed = true;
      } catch (err) {
        console.error(`[contact] Email failed: ${explainMailError(err)}`);
      }
    } else {
      console.warn('[contact] Email is not configured. Set SMTP_USER and SMTP_PASS in backend/.env and restart the backend.');
    }

    if (isDbConnected()) {
      try {
        // Only the three validated fields are saved; anything else in the body is ignored.
        await Contact.create(values);
      } catch (err) {
        console.error(`[contact] Saving the backup copy to MongoDB failed: ${err.message}`);
      }
    }

    if (!emailed) {
      return res.status(503).json({
        success: false,
        message: 'Your message could not be emailed right now. Please try again later.',
      });
    }

    res.status(201).json({ success: true, message: 'Thank you! Your message has been sent.' });
  } catch (err) {
    next(err);
  }
}
