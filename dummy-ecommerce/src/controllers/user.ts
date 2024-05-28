import { Request, Response } from "express";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Address } from "@prisma/client";
import { BadRequestException } from "../exceptions/bad-request";

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

export const updateUser = async(request: Request, response: Response) => {
    const validatedData = UpdateUserSchema.parse(request.body);

    let shippingAddress: Address;
    let billingAddress: Address;

    if(validatedData.defaultShippingAddress){
        try {
            shippingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultShippingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException('Address not found', ErrorCodes.ADDRESS_NOT_FOUND)
        }
        if(shippingAddress.userId != request.user.id){
            throw new BadRequestException('Address does not belong to user', ErrorCodes.ADDRESS_NOT_BELONG)
        }
    }

    if(validatedData.defaultBillingAddress){
        try {
            billingAddress = await prismaClient.address.findFirstOrThrow({
                where: {
                    id: validatedData.defaultBillingAddress
                }
            })
        } catch (error) {
            throw new NotFoundException('Address not found', ErrorCodes.ADDRESS_NOT_FOUND)
        }
        if(billingAddress.userId != request.user.id){
            throw new BadRequestException('Address does not belong to user', ErrorCodes.ADDRESS_NOT_BELONG)
        }
    }

    const updatedUser = await prismaClient.user.update({
        where: {
            id: request.user.id
        },
        data: {
            defaultShippingAddress: validatedData.defaultShippingAddress ?? request.user.defaultShippingAddress,
            defaultBillingAddress: validatedData.defaultBillingAddress ?? request.user.defaultBillingAddress,
            name: validatedData.name ?? request.user.name
        }
    })
    response.json(updatedUser);
}