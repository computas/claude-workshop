import type { Request, Response, NextFunction } from 'express';
import { technicalLogger } from '../utils/logger.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  technicalLogger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({ error: err.message || 'Internal server error' });
}
