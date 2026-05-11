import express from "express";

import { placeOrder } from "../controller/orderController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();
// api đặt hàng

router.post('/place-order', verifyToken, placeOrder);







export default router;