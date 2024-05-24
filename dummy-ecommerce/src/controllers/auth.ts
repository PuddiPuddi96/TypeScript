import { NextFunction, Request, Response } from 'express';
import { prismaClient } from '..';
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';

export const signup = async (request: Request, response: Response, next: NextFunction) => {
    const { email, password, name } = request.body;

    let user = await prismaClient.user.findFirst({
        where: {email}
    });

    if(user){
        next(
            new BadRequestException(
                'User already exists!',
                ErrorCodes.USER_ALREADY_EXISTS)
        );
    }

    user = await prismaClient.user.create({
        data: {
            name,
            email,
            password: hashSync(password, 10)
        }
    })
    response.json(user);
}

export const login = async (request: Request, response: Response) => {
    const { email, password } = request.body;

    let user = await prismaClient.user.findFirst({
        where: {email}
    });

    if(!user){
        throw Error("User doesn't exists!");
    }

    if(!compareSync(password, user.password)){
        throw Error('Incorrect password');
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    response.json({user, token});
}