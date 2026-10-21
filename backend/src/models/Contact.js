import mongoose from 'mongoose';
import { LIMITS } from '../utils/validate.js';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: LIMITS.nameMin, maxlength: LIMITS.nameMax },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: LIMITS.emailMax },
    message: { type: String, required: true, trim: true, minlength: LIMITS.messageMin, maxlength: LIMITS.messageMax },
  },
  { timestamps: true },
);

export default mongoose.model('Contact', contactSchema);
