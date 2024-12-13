"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardMetrics = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getDashboardMetrics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lowProducts = yield prisma.products.findMany({
            take: 15,
            orderBy: {
                quantity: "asc",
            },
        });
        const lastTransactions = yield prisma.transaction.findMany({
            include: {
                product: {
                    select: {
                        name: true,
                        code: true,
                        row: true,
                        description: true,
                    },
                },
            },
            take: 10,
            orderBy: {
                date: "desc",
            },
        });
        const totalTransactionsQty = yield prisma.transaction.groupBy({
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
        const totalProductQty = yield prisma.products.aggregate({
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
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving dashboard metrics " });
    }
});
exports.getDashboardMetrics = getDashboardMetrics;
