import { Request, Response } from "express";
import { AddressSchema } from "../schema/users";
import { User } from "@prisma/client";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const addAddress = async(request: Request, response: Response) => {
    AddressSchema.parse(request.body);

    let user: User;
    try {
        user = await prismaClient.user.findFirstOrThrow({
            where: {
                id: request.body.userId
            }
        })
    } catch (error) {
        throw new NotFoundException('User not found', ErrorCodes.USER_NOT_FOUND);
    }

    const address = await prismaClient.address.create({
        data: {
            ...request.body,
            userId: user.id
        }
    })
    response.json(address);

};

export const deleteAddress = async(request: Request, response: Response) => {
    
};

export const listAddress = async(request: Request, response: Response) => {
    
};