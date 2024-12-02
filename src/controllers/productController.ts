import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProducts = async (
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const products = await prisma.products.findMany({
        });
        res.json(products);
    }catch (error) {
        res.status(500).json({ message:"Error retrieving Products "})
    }
};


export const createProduct = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { productId, name, code, price, description, quantity } = req.body;

      if (!name || !code || !price ) {
        res.status(400).json({ message: "Missing required fields" });
      }

      const product = await prisma.products.create({
        data: {
          productId,
          name,
          code,
          price,
          description,
          quantity,
        },
      });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error creating product" });
      console.log(error)
    }
  };