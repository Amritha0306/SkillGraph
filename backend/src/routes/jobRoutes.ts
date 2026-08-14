import { Router } from 'express';
import { jobController } from '../controllers/jobController';

const router = Router();

// GET /api/jobs
router.get('/', (req, res, next) => jobController.getAllJobs(req, res, next));

// GET /api/jobs/:id
router.get('/:id', (req, res, next) => jobController.getJobById(req, res, next));

export default router;
