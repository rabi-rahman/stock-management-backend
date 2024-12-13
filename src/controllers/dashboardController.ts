import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (
    req: Request,
    res: Response
): Promise<void> => {
    try{
        const lowProducts = await prisma.products.findMany({
            take: 15,
            orderBy: {
                quantity: "asc",
        },
    });

        const lastTransactions = await prisma.transaction.findMany({
            include: {
                product: {
                  select: {
                    name: true,
                    code: true,
                    row:true,
                    description:true,
                  },
                },
              },
                take:10,
                orderBy: {
                    date: "desc",
        },
    });

    const totalTransactionsQty = await prisma.transaction.groupBy({
      by: ['transactionType'],
      _sum: {
        quantity: true, 
      },
      where: {
        transactionType: {
          in: ['sale', 'return'],
        },
      },
    });

    const totalTransactionsQuantity = totalTransactionsQty.map((transaction) => ({
      type: transaction.transactionType,
      quantity: transaction._sum.quantity || 0,
    }));

    const totalProductQty = await prisma.products.aggregate({
      _sum: {
        quantity: true,
      },
    });

    const totalProductQuantity = totalProductQty._sum.quantity || 0;

    res.json({
        lowProducts,
        lastTransactions,
        // lastAddedProducts,
        totalTransactionsQuantity,
        totalProductQuantity
    })

    }catch (error) {
        res.status(500).json({ message:"Error retrieving dashboard metrics "})
    }
}