import express from 'express'

import { getUserByEmail, createUser } from '../db/users';
import { random, authentication } from '../helpers'
import { MESSAGEConstants } from '../constants/message';

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            console.log(MESSAGEConstants.BAD_REQUEST);
            return res.sendStatus(400);
        }

        const user = await getUserByEmail(email)
            .select('+authentication.salt +authentication.password');
        if(!user){
            console.log(MESSAGEConstants.USER_NO_FOUD);
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password !== expectedHash){
            console.log(MESSAGEConstants.PASSWORD_KO);
            return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie(
            'PUDDI-AUTH',
            user.authentication.sessionToken,
            { domain: 'localhost', path: '/' }
        );

        console.log(MESSAGEConstants.OPERATION_OK);
        return res.status(200).json(user).end();
    }catch(error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}

export const register = async(req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if(!email || !password || !username){
            console.log(MESSAGEConstants.BAD_REQUEST);
            return res.sendStatus(400);
        }

        const existingUser = await getUserByEmail(email);
        if(existingUser){
            console.log(MESSAGEConstants.EMAIL_USED);
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        });

        console.log(MESSAGEConstants.OPERATION_OK);
        return res.status(200).json(user).end();
    } catch (error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}