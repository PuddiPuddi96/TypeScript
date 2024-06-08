import { CustomError } from "../utils/CustomError";

export class DatabaseError extends CustomError {
  constructor() {
    super('Database crashed. Try again later');
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }

  StatusCode = 500;
  
  serialize(): { message: string; } {
    return {message: 'Database crashed. Try again later'}
  }
}
