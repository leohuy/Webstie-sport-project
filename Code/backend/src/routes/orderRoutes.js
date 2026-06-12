import express from "express";

import { placeOrder, getUserOrders } from "../controller/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
// api đặt hàng

router.post('/', verifyToken, placeOrder);
router.get('/', verifyToken, getUserOrders);






export default router;