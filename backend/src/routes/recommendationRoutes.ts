import { Router } from 'express';
import { recommendationController } from '../controllers/recommendationController';

const router = Router();

// POST /api/recommendations
router.post('/', (req, res, next) => recommendationController.getRecommendations(req, res, next));

export default router;
