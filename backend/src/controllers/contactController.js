import Contact from '../models/Contact.js';
import { validateContact } from '../utils/validate.js';

// POST /api/contact
export async function createContact(req, res, next) {
  try {
    const { values, errors } = validateContact(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
    }

    // Only the three validated fields are saved; anything else in the body is ignored.
    await Contact.create(values);
    res.status(201).json({ success: true, message: 'Thank you! Your message has been sent.' });
  } catch (err) {
    next(err);
  }
}
