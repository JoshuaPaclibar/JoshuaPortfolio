import { Router } from 'express';
import { getProjects, getProjectById } from '../controllers/projectController.js';
import requireDb from '../middleware/requireDb.js';

const router = Router();

router.get('/', requireDb, getProjects);
router.get('/:id', requireDb, getProjectById);

export default router;
