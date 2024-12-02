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
exports.productReturn = exports.productSale = exports.getTransactions = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield prisma.transaction.findMany({
            include: {
                product: true,
            },
        });
        res.json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Transactions " });
    }
});
exports.getTransactions = getTransactions;
const productSale = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId, productId, quantity, remarks } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ message: "Invalid input. Please provide a valid productId and quantity" });
            return;
        }
        const product = yield prisma.products.findUnique({
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
        const updatedProduct = yield prisma.products.update({
            where: { productId },
            data: { quantity: product.quantity - quantity },
        });
        const transaction = yield prisma.transaction.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing sale transaction" });
    }
});
exports.productSale = productSale;
const productReturn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId, productId, quantity, remarks } = req.body;
        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ message: "Invalid input. Please provide a valid productId and quantity" });
            return;
        }
        const product = yield prisma.products.findUnique({
            where: { productId },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const updatedProduct = yield prisma.products.update({
            where: { productId },
            data: { quantity: product.quantity + quantity },
        });
        const transaction = yield prisma.transaction.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error processing return transaction" });
    }
});
exports.productReturn = productReturn;
