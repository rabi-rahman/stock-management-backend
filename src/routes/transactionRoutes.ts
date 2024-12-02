import { Router } from "express";
import { productSale, getTransactions, productReturn } from "../controllers/transactionController";

const router = Router();

router.get("/", getTransactions);
router.post("/AddtoShop", productSale);
router.post("/AddtoStore", productReturn);

export default router;