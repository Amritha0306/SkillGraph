import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log internal error with stack trace for backend observability
  console.error('[SkillGraph Error Handler]:', {
    method: req.method,
    path: req.originalUrl,
    message: err.message,
    code: err.code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle Neo4j specific errors
  if (err.name === 'Neo4jError' || err.code?.startsWith('Neo.')) {
    res.status(500).json({
      success: false,
      error: 'A graph database operation failed. Please check connection and query parameters.',
      code: err.code || 'DATABASE_ERROR',
    });
    return;
  }

  // Handle connection errors
  if (err.message && err.message.includes('CognoDB is not configured')) {
    res.status(503).json({
      success: false,
      error: 'SkillGraph is temporarily unable to reach the graph database. Database credentials are missing or unconfigured.',
      code: 'DB_UNCONFIGURED',
    });
    return;
  }

  // Default response
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'An internal server error occurred.',
  });
}
