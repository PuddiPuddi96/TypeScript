import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";


const authMiddleware = async(request: Request, response: Response, next: NextFunction) => {
    const token = request.headers.authorization;
    if(!token){
        next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED, ''))
    }else{
        try {
            const payload = jwt.verify(token, JWT_SECRET) as any;
            
            const user = 
                await prismaClient
                    .user
                    .findFirst(
                        {where: {id: payload.userId}}
                    );
            if(!user){
                next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED, ''));
            }else {
                request.user = user;
                next();
            }
        } catch (error) {
            next(new UnauthorizedException('Unauthorized', ErrorCodes.UNAUTHORIZED, ''));
        }
    }
}

export default authMiddleware;