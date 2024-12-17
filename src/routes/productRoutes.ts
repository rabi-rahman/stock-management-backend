import { Router } from "express";
import { addStock, createProduct, deleteProduct, editProduct, getProducts } from "../controllers/productController";

const router = Router();

router.get("/", getProducts);
router.post("/", createProduct);
router.delete("/:productId", deleteProduct);
router.put("/:productId", editProduct);
router.patch("/:productId/add-stock", addStock);


export default router;