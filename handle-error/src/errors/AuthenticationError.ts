import { CustomError } from "../utils/CustomError";

export class AuthenticactionError extends CustomError {
  constructor() {
    super('user unauthenticated');
    Object.setPrototypeOf(this, AuthenticactionError.prototype);
  }

  StatusCode = 401;

  serialize(): { message: string; } {
    return {message: 'user unauthenticated'}
  }
}
