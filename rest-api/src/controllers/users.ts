import express from 'express';

import { deleteUserById, getUserById, getUsers } from '../db/users';
import { MESSAGEConstants } from '../constants/message';

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try{
        const users = await getUsers();

        console.log(MESSAGEConstants.OPERATION_OK);
        return res.status(200).json(users);
    }catch(error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        
        const deleteUser = await deleteUserById(id);

        console.log(MESSAGEConstants.OPERATION_OK);
        return res.json(deleteUser);
    }catch(error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}

export const updateUser = async(req: express.Request, res: express.Response) => {
    try{
        const { id } = req.params;
        const { username } = req.body;
        
        if(!username){
            console.log(MESSAGEConstants.BAD_REQUEST);
            return res.sendStatus(400);
        }

        const user = await getUserById(id);

        user.username = username;
        await user.save();

        console.log(MESSAGEConstants.OPERATION_OK);
        return res.status(200).json(user).end();
    }catch(error){
        console.log(MESSAGEConstants.OPERATION_KO, {error});
        return res.sendStatus(400);
    }
}