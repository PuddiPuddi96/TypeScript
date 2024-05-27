import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

const adminMiddleware = async(request: Request, response: Response, next: NextFunction) => {
    const user = request.user;
    if(user.role == "ADMIN"){
        console.log('IS ADMIN')
        next();
    }else{
        console.log('IS NOT ADMIN')
        next(new UnauthorizedException('Unauthotorized', ErrorCodes.UNAUTHORIZED, ''))
    }
}

export default adminMiddleware;