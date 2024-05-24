import { ErrorCodes, HttpException } from "./root";

export class InternalException extends HttpException {
    constructor(message: string, errors: string | string[], errorCode: ErrorCodes) {
        super(message, errorCode, 500, errors);
    }
}