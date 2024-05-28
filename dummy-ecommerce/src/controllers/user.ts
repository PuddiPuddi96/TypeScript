import { Request, Response } from "express";
import { AddressSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const addAddress = async(request: Request, response: Response) => {
    AddressSchema.parse(request.body);

    const address = await prismaClient.address.create({
        data: {
            ...request.body,
            userId: request.user.id
        }
    })
    response.json(address);

};

export const deleteAddress = async(request: Request, response: Response) => {
    try {
        await prismaClient.address.delete({
            where: {
                id: Number(request.params.id)
            }
        })
        response.json({success: true});
    } catch (error) {
        throw new NotFoundException('Address not found', ErrorCodes.ADDRESS_NOT_FOUND)
    }
    
};

export const listAddress = async(request: Request, response: Response) => {
    const addresses = await prismaClient.address.findMany({
        where: {
            userId: request.user.id
        }
    })
    response.json(addresses);
    
};