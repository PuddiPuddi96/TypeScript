import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { UnauthorizedException } from "../exceptions/unauthorized";

export const addItemToCart = async(request: Request, response: Response) => {
    //TODO: check for the existence of the same product in user's cart and alter the quantity as required
    const validatedData = CreateCartSchema.parse(request.body);

    let product: Product;

    try {
        product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: validatedData.productId
            }
        })

        const cart = await prismaClient.cartItem.create({
            data: {
                userId: request.user.id,
                productId: product.id,
                quantity: validatedData.quantity
            }
        })

        response.json(cart);
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND);
    }

}

export const deleteItemFromCart = async(request: Request, response: Response) => {
    try {
        let cart = await prismaClient.cartItem.findFirstOrThrow({
            where: {
                id: Number(request.params.id),
                userId: request.user.id
            }
        })
    } catch (error) {
        throw new UnauthorizedException('This cart does not belong to the logged in user', ErrorCodes.UNAUTHORIZED, '')
    }

    await prismaClient.cartItem.delete({
        where: {
            id: Number(request.params.id)
        }
    })

    response.json({success: true})
}

export const changeQuantity = async(request: Request, response: Response) => {
    //TODO: Check if user is updating its own cart item
    const validatedData = ChangeQuantitySchema.parse(request.body);

    const updatedcart = await prismaClient.cartItem.update({
        where: {
            id: Number(request.params.id)
        },
        data: {
            quantity: validatedData.quantity
        }
    })

    response.json(updatedcart);
}

export const getCart = async(request: Request, response: Response) => {
    const cart = await prismaClient.cartItem.findMany({
        where: {
            userId: request.user.id
        },
        include: {
            product: true
        }
    })

    response.json(cart);
}