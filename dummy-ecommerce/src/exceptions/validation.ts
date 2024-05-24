import { ErrorCodes, HttpException } from './root';

export class UnprocessableEntity extends HttpException {
    constructor(
        error: string | string[], 
        message: string, 
        errorCode: ErrorCodes){
        
            super(message, errorCode, 422, error);
    }
}