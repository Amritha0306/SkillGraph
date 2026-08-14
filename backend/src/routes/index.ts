import { Router, Request, Response } from 'express';
import { db } from '../db/neo4j';
import skillRoutes from './skillRoutes';
import jobRoutes from './jobRoutes';
import recommendationRoutes from './recommendationRoutes';
import userRoutes from './userRoutes';

const router = Router();

// GET /api/health
router.get('/health', async (req: Request, res: Response) => {
  try {
    const dbHealth = await db.verifyConnectivity();
    const statusCode = dbHealth.connected ? 200 : 503;
    res.status(statusCode).json({
      status: dbHealth.connected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'SkillGraph Backend API',
      database: dbHealth,
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      service: 'SkillGraph Backend API',
      database: {
        connected: false,
        message: error.message || 'Database health check failed.',
      },
    });
  }
});

router.use('/skills', skillRoutes);
router.use('/jobs', jobRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/users', userRoutes);

export default router;
