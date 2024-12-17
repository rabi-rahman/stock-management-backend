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
exports.addStock = exports.editProduct = exports.deleteProduct = exports.createProduct = exports.getProducts = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield prisma.products.findMany({});
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving Products " });
    }
});
exports.getProducts = getProducts;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, name, code, row, description, quantity } = req.body;
        if (!code || !quantity) {
            res.status(400).json({ message: "Missing required fields" });
        }
        const product = yield prisma.products.create({
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
    }
    catch (error) {
        res.status(500).json({ message: "Error creating product" });
        console.log(error);
    }
});
exports.createProduct = createProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const product = yield prisma.products.findUnique({
            where: { productId },
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        yield prisma.transaction.deleteMany({
            where: { productId },
        });
        yield prisma.products.delete({
            where: { productId },
        });
        res.status(200).json({ message: "Product and related transactions deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting product and transactions:", error);
        res.status(500).json({ message: "Error deleting product and transactions" });
    }
});
exports.deleteProduct = deleteProduct;
const editProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { name, code, row, description, quantity } = req.body;
        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }
        console.log('Request body:', req.body);
        const updatedProduct = yield prisma.products.update({
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
    }
    catch (error) {
        console.error("Error updating product:", error);
    }
});
exports.editProduct = editProduct;
const addStock = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }
        if (!quantity || quantity <= 0) {
            res
                .status(400)
                .json({ message: "Quantity to add must be a positive number" });
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
            data: {
                quantity: product.quantity + quantity,
            },
        });
        res.status(200).json({
            message: "Stock added successfully",
            updatedProduct,
        });
    }
    catch (error) {
        console.error("Error adding stock:", error);
        res.status(500).json({ message: "Error adding stock to product" });
    }
});
exports.addStock = addStock;
