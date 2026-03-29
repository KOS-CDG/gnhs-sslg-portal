import type { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode ?? 500;
  const message    = err.message    ?? 'Internal server error.';

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${statusCode} — ${message}`);
    console.error(err.stack);
  }

  res.status(statusCode).json({ message });
};

/** Helper to create typed errors with an HTTP status code */
export function createError(message: string, statusCode = 400): AppError {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  return err;
}
