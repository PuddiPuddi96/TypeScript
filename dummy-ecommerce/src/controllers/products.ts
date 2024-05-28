import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCodes } from "../exceptions/root";

export const createProduct = async(request: Request, response: Response) => {
    let product = await prismaClient.product.create({
        data: {
            ...request.body,
            tags: request.body.tags.join(',')
        }
    });
    response.json(product);
}

export const updateProduct = async(request: Request, response: Response) => {
    try {
        const product = request.body;
        if(product.tags){
            product.tags = product.tags.join(',');
        }

        const updateProduct = await prismaClient.product.update({
            where: {
                id: Number(request.params.id)
            },
            data: product
        })

        response.json(updateProduct);
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}

export const deleteProduct = async(request: Request, response: Response) => {
    try {
        await prismaClient.product.delete({
            where: {
                id: Number(request.params.id)
            }
        })

        response.json({success: true});
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}

export const listProducts = async(request: Request, response: Response) => {
    const productsCount = await prismaClient.product.count();
    const products = await prismaClient.product.findMany({
        skip: Number(request.query.skip) || 0,
        take: 5
    })
    response.json({
        productsCount,
        data: products
    })
}

export const getProductById = async(request: Request, response: Response) => {
    try {
        const product = await prismaClient.product.findFirstOrThrow({
            where: {
                id: Number(request.params.id)
            }
        })

        response.json(product);
    } catch (error) {
        throw new NotFoundException('Product not found', ErrorCodes.PRODUCT_NOT_FOUND)
    }
}