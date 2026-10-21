import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    technologies: { type: [{ type: String, trim: true, maxlength: 40 }], default: [] },
    // Path under frontend/public (e.g. "/images/devify.png") or a full image URL.
    image: { type: String, trim: true, default: '' },
    githubUrl: { type: String, trim: true, default: '' },
    liveUrl: { type: String, trim: true, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model('Project', projectSchema);
