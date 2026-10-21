import Project from '../models/Project.js';
import { isValidObjectId } from '../utils/validate.js';

// GET /api/projects
export async function getProjects(req, res, next) {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: 1 }).lean();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects/:id
export async function getProjectById(req, res, next) {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid project id.' });
    }
    const project = await Project.findById(id).lean();
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    res.json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
}
