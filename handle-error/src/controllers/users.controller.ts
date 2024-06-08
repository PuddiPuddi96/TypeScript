import {NextFunction, Request, Response} from 'express';
import { DatabaseError } from '../errors/DatabaseError';
import { AuthenticactionError } from '../errors/AuthenticationError';
import { BadRequestError } from '../errors/BadRequestError';

async function httpSignUp(
  request: Request,
  response: Response,
  next: NextFunction
) {
  next(new DatabaseError());
}

function httpSignIn() {
  throw new AuthenticactionError();
}

function httpSignOut() {
  throw new BadRequestError('Sorry, we are not available now');
}

export {httpSignUp, httpSignIn, httpSignOut};
