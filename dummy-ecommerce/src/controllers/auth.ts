import { NextFunction, Request, Response } from 'express'
import { prismaClient } from '..';
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { BadRequestException } from '../exceptions/bad-request';
import { ErrorCodes } from '../exceptions/root';
import { SignUpSchema } from '../schema/users';
import { NotFoundException } from '../exceptions/not-found';

export const signup = async (request: Request, response: Response, next: NextFunction) => {
    SignUpSchema.parse(request.body);

    const { email, password, name } = request.body;

    let user = await prismaClient.user.findFirst({
        where: { email }
    });

    if (user) {
        new BadRequestException('User already exists!', ErrorCodes.USER_ALREADY_EXISTS)
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
        throw new NotFoundException("User not found!", ErrorCodes.USER_NOT_FOUND);
    }

    if(!compareSync(password, user.password)){
        throw new BadRequestException('Incorrect password', ErrorCodes.INCORRECT_PASSWORD);
    }

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    response.json({user, token});
}

export const me = async (request: Request, response: Response) => {
    response.json(request.user);
}