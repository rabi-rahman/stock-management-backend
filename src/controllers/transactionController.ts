import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTransactions = async (
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const transactions = await prisma.transaction.findMany({
            include: {
                product: true,
            },
        });
        res.json(transactions);
    }catch (error) {
        res.status(500).json({ message:"Error retrieving Transactions "})
    }
};


export const productSale = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { transactionId, productId, quantity, remarks } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ message: "Invalid input. Please provide a valid productId and quantity" });
            return;
        }

        const product = await prisma.products.findUnique({
            where: { productId },
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        if (product.quantity < quantity) {
            res.status(400).json({ message: "Not enough stock to complete sale" });
            return;
        }

        const updatedProduct = await prisma.products.update({
            where: { productId },
            data: { quantity: product.quantity - quantity },
        });

        const transaction = await prisma.transaction.create({
            data: {
                transactionId,
                productId,
                quantity,
                transactionType: "sale",
                remarks,
            },
        });

        res.status(200).json({
            message: "Product sold successfully",
            transaction,
            updatedProduct: {
                productId: updatedProduct.productId,
                name: updatedProduct.name,
                quantity: updatedProduct.quantity,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing sale transaction" });
    }
};


export const productReturn = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { transactionId,productId, quantity, remarks } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ message: "Invalid input. Please provide a valid productId and quantity" });
            return;
        }

        const product = await prisma.products.findUnique({
            where: { productId },
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        const updatedProduct = await prisma.products.update({
            where: { productId },
            data: { quantity: product.quantity + quantity },
        });

        const transaction = await prisma.transaction.create({
            data: {
                transactionId,
                productId,
                quantity,
                transactionType: "return", 
                remarks,
            },
        });

        res.status(200).json({
            message: "Product returned successfully",
            transaction,
            updatedProduct: {
                productId: updatedProduct.productId,
                name: updatedProduct.name,
                quantity: updatedProduct.quantity,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing return transaction" });
    }
};