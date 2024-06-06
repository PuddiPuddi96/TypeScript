import {NextFunction, Request, Response} from 'express';

async function httpSignUp(
  request: Request,
  response: Response,
  next: NextFunction
) {
  next(new Error('Sign up error'));
}

function httpSignIn() {
  throw new Error('Sign in error');
}

function httpSignOut() {
  throw new Error('Sorry, we are not available now');
}

export {httpSignUp, httpSignIn, httpSignOut};
