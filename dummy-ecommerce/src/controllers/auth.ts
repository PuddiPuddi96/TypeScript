import { Request, Response } from 'express';
import { prismaClient } from '..';
import { compareSync, hashSync } from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';

export const signup = async (request: Request, response: Response) => {
    const { email, password, name } = request.body;

    let user = await prismaClient.user.findFirst({
        where: {email}
    });

    if(user){
        throw Error('User already exists!');
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