import { ErrorCodes, HttpException } from "./root";

export class UnauthorizedException extends HttpException {
    constructor(message: string, errorCode: ErrorCodes, errors: string | string[]){
        super(message, errorCode, 401, errors);
    }
}