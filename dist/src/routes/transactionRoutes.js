"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const router = (0, express_1.Router)();
router.get("/", transactionController_1.getTransactions);
router.post("/AddtoShop", transactionController_1.productSale);
router.post("/AddtoStore", transactionController_1.productReturn);
exports.default = router;
