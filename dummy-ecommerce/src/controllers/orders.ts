import { Request, Response } from "express";
import { prismaClient } from "..";
import { OrderEventStatus } from "@prisma/client";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createOrder = async(request: Request, response: Response) => {
    //Create transaction
    return await prismaClient.$transaction(async(tx) => {
        //recovery of items in the cart
        const cartItems = await tx.cartItem.findMany({
            where: {
                userId: request.user.id
            },
            include: {
                product: true
            }
        });

        //Check if cart is empty
        if(cartItems.length === 0){
            return response.json({message: 'Cart is empty'})
        }

        //Calculate total
        const price = cartItems.reduce((prev, current) => {
            return prev + (current.quantity * +current.product.price)
        }, 0);

        //Recovery shipping address
        const address = await tx.address.findFirst({
            where: {
                id: Number(request.user.defaultShippingAddress)
            }
        })

        //Create order
        const order = await tx.order.create({
            data: {
                userId: request.user.id,
                netAmount: price,
                address: String(address?.formattedAddress),
                products: {
                    create: cartItems.map((cart) => {
                        return {
                            productId: cart.productId,
                            quantity: cart.quantity
                        }
                    })
                }

            }
        })

        //create order event
        await tx.orderEvents.create({
            data: {
                orderId: order.id
            }
        })

        //delete cart
        await tx.cartItem.deleteMany({
            where: {
                userId: request.user.id
            }
        })
        return response.json(order)
    })

}

export const listOrders = async(request: Request, response: Response) => {
    const orders = await prismaClient.order.findMany({
        where: {
            userId: request.user.id
        }
    })
    response.json(orders);
}

export const cancelOrder = async(request: Request, response: Response) => {
    //TODO: wrap in a transaction
    //TODO: check if the user is cancelling its own order
    try {
        const order = await prismaClient.order.update({
            where: {
                id: Number(request.params.id)
            },
            data: {
                status: OrderEventStatus.CANCELLED
            }
        })
        await prismaClient.orderEvents.create({
            data: {
                orderId: order.id,
                status: OrderEventStatus.CANCELLED
            }
        })
        response.json(order)
    } catch (error) {
        throw new NotFoundException('Order not found', ErrorCodes.ORDER_NOT_FOUND)
    }
}

export const getOrderById = async(request: Request, response: Response) => {
    try {
        const order = await prismaClient.order.findFirstOrThrow({
            where: {
                id: Number(request.params.id)
            },
            include: {
                products: true,
                events: true
            }
        })
        response.json(order)
    } catch (error) {
        throw new NotFoundException('Order not found', ErrorCodes.ORDER_NOT_FOUND)
    }
}