import express from 'express';
import { get, merge} from 'lodash';

import { getUserBySessionToken } from '../db/users';

export const isOwner = async(req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const { id } = req.params;
        const currentUserId = get(req, 'identity._id') as string;

        if(!currentUserId){
            console.log("Primo controllo");
            return res.sendStatus(403);
        }

        if(currentUserId.toString() !== id){
            console.log("Secondo controllo");
            return res.sendStatus(403);
        }

        return next();
    }catch(error){
        console.log("Errore durante la verifica: " + error);
        return res.sendStatus(400);
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        const sessionToken = req.cookies['PUDDI-AUTH'];
        if(!sessionToken){
            console.log('Cookie non presente');
            return res.sendStatus(403);
        }

        const existingUser = await getUserBySessionToken(sessionToken);
        if(!existingUser){
            console.log('Utente non in sessione');
            return res.sendStatus(403);
        }

        merge(req, { identity: existingUser });

        return next();
    }catch(error){
        console.log("Errore durante l'autenticazione: " + error);
        return res.sendStatus(400);
    }
}