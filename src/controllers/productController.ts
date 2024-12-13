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
      const { productId, name, code, row, description, quantity } = req.body;

      if (!code || !quantity ) {
        res.status(400).json({ message: "Missing required fields" });
      }

      const product = await prisma.products.create({
        data: {
          productId,
          name,
          code,
          row,
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


  export const deleteProduct = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { productId } = req.params;

        const product = await prisma.products.findUnique({
            where: { productId },
        });

        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }

        await prisma.transaction.updateMany({
            where: { productId },
            data: { productId: null },
        });

        await prisma.products.delete({
            where: { productId },
        });

        res.status(200).json({ message: "Product deleted and transaction data preserved" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Error deleting product" });
    }
};

export const editProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.params; 
    const { name, code, row, description, quantity } = req.body; 

    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    console.log('Request body:', req.body);

    const updatedProduct = await prisma.products.update({
      where: { productId },
      data: {
        name,
        code,
        row,
        description,
        quantity,
      },
    });
    
    console.log('Updated Product:', updatedProduct);

    res.status(200).json({ message: "Product updated successfully", updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
  }

  
};



  