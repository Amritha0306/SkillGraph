import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// GET /api/users
router.get('/', (req, res, next) => userController.getAllUsers(req, res, next));

// GET /api/users/:id
router.get('/:id', (req, res, next) => userController.getUserById(req, res, next));

// POST /api/users/:id/skills
router.post('/:id/skills', (req, res, next) => userController.addUserSkills(req, res, next));

export default router;
