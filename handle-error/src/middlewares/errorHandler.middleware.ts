import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import { DatabaseError } from '../errors/DatabaseError';
import { AuthenticactionError } from '../errors/AuthenticationError';
import { BadRequestError } from '../errors/BadRequestError';
import { CustomError } from '../utils/CustomError';

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  if(error instanceof CustomError){
    return response.status(error.StatusCode).json(error.serialize);
  }

  return response.status(400).json({message: 'aaaaaaaaaa'});
};
