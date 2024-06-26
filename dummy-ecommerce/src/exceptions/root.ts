export class HttpException extends Error {
    message: string;
    errorCode: ErrorCodes;
    statusCode: number;
    errors: string | string [];

    constructor(
        message: string,
        errorCode: ErrorCodes, 
        statusCode: number, 
        errors: string | string []) {
        
            super()
            this.message = message;
            this.errorCode = errorCode;
            this.statusCode = statusCode;
            this.errors = errors;
    }
}

export enum ErrorCodes {
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002,
    INCORRECT_PASSWORD = 1003,
    ADDRESS_NOT_FOUND = 1004,
    ADDRESS_NOT_BELONG = 1005,
    UNPROCESSABLE_ENTITY = 2001,
    INTERNAL_EXCEPTION = 3001,
    UNAUTHORIZED = 4001,
    PRODUCT_NOT_FOUND = 5001,
    ORDER_NOT_FOUND = 6001
}