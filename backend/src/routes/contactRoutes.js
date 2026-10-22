import { Router } from 'express';
import { createContact } from '../controllers/contactController.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { validateContact } from '../utils/validate.js';

const router = Router();

// Invalid input is rejected with 400 first, so users always get field-level feedback.
const validateFirst = (req, res, next) => {
  const { errors } = validateContact(req.body);
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ success: false, message: 'Please fix the highlighted fields.', errors });
  }
  next();
};

router.post('/', contactLimiter, validateFirst, createContact);

export default router;
