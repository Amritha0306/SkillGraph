import express, { Express } from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config/env';

export function createApp(): Express {
  const app = express();

  // Middleware
  const allowedOrigins = [
    config.clientUrl,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      // Allow any vercel.app subdomain (covers all preview + production deployments)
      if (origin.endsWith('.vercel.app')) return callback(null, true);
      // Allow explicitly configured origins
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS: Origin '${origin}' not allowed`));
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root endpoint info
  app.get('/', (req, res) => {
    res.json({
      name: 'SkillGraph Backend API',
      tagline: 'Turn your skills into your next opportunity.',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        skills: '/api/skills',
        jobs: '/api/jobs',
        recommendations: 'POST /api/recommendations',
        users: '/api/users',
      },
    });
  });

  // Mount API routes
  app.use('/api', routes);

  // Centralized Error Handling
  app.use(errorHandler);

  return app;
}
