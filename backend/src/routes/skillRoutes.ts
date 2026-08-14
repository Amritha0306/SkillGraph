import { Router } from 'express';
import { skillController } from '../controllers/skillController';

const router = Router();

// GET /api/skills
router.get('/', (req, res, next) => skillController.getAllSkills(req, res, next));

// GET /api/skills/:name/related
router.get('/:name/related', (req, res, next) => skillController.getRelatedSkills(req, res, next));

export default router;
