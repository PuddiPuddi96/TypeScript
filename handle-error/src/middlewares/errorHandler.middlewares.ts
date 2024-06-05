import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {};
