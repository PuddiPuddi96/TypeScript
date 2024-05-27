import { Request, Response } from "express";
import { prismaClient } from "..";
import { date } from "zod";

export const createProduct = async(request: Request, response: Response) => {
    let product = await prismaClient.product.create({
        data: {
            ...request.body,
            tags: request.body.tags.join(',')
        }
    });
    response.json(product);
}