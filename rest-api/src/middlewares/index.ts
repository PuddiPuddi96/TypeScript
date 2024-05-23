import express from 'express';
import { get, merge } from 'lodash';

import { getUserBySessionToken } from '../db/users';
import { MESSAGEConstants } from '../constants/message';

export const isOwner = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            console.log(MESSAGEConstants.USER_NO_LOGIN);
            return res.sendStatus(403);
        }

        if(currentUserId.toString() !== id){
            console.log(MESSAGEConstants.USER_WRONG);
            return res.sendStatus(403);
        }

        console.log(MESSAGEConstants.IS_OWNER_OK);
        return next();
    }catch(error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['PUDDI-AUTH'];
        if(!sessionToken){
            console.log(MESSAGEConstants.COOKIE_NOT_FOUND);
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            console.log(MESSAGEConstants.USER_NO_FOUD);
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        console.log(MESSAGEConstants.IS_AUTHENTICATED);
        return next();
    }catch(error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}