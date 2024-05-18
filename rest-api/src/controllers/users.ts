import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await getUsers();

        return res.status(200).json(users);
    }catch(error){
        console.log("Errore durante il recupero: " + error);
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        
        const deleteUser = await deleteUserById(id);

        return res.json(deleteUser);
    }catch(error){
        console.log("Errore durante l'eliminazione: " + error);
        return res.sendStatus(400);
    }
}

export const updateUser = async(req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        const { username } = req.body;
        
        if(!username){
            console.log("Richiesta non completa");
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        user.username = username;
        await user.save();

        return res.status(200).json(user).end();
    }catch(error){
        console.log("Errore durante l'aggiornamento: " + error);
        return res.sendStatus(400);
    }
}