import { CustomError } from "../utils/CustomError";

export class BadRequestError extends CustomError {
  constructor(
    public message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  StatusCode = 400;

  serialize(): { message: string; } {
    return {message: 'Bad request'}
  }
}
