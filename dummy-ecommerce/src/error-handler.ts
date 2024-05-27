import { NextFunction, Request, Response } from "express"
import { ErrorCodes, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal-exception";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad-request";

export const errorHandler = (method: Function) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            await method(request, response, next);
        } catch (error: any) {
            let exception: HttpException;
            if(error instanceof HttpException){
                exception = error;
            }else{
                if(error instanceof ZodError){
                    exception = new BadRequestException(
                        'Unprocessable entity',
                        ErrorCodes.UNPROCESSABLE_ENTITY)
                }else{
                    exception = new InternalException(
                        'Something went wrong!', 
                        error, 
                        ErrorCodes.INTERNAL_EXCEPTION)
                }
            }
            next(exception);
        }
    }
}