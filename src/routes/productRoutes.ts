import { Router } from "express";
import { createProduct, deleteProduct, editProduct, getProducts } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:productId", deleteProduct);
router.put("/:productId", editProduct);


export default router;