import { NextFunction, Request, Response } from 'express'
import AppError from '../errors/AppError'

export const errorHandler = (error: unknown, _req: Request, res: Response, _next: NextFunction): Response => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
}
