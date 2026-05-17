import express from "express";
import { getAdminOrders, updateOrderStatus } from "../controller/adminOrderController.js";
import { verifyToken } from "../middleware/authMiddleware.js"; 
import { isAdminOrStaff } from "../middleware/authMiddleware.js";
import { getInventory, updateStock } from "../controller/inventoryController.js";
const router = express.Router();

// router.get('/orders', verifyToken, isAdminOrStaff, getAdminOrders);
// router.put('/orders/:id/status', verifyToken, isAdminOrStaff, updateOrderStatus);
// router.get('/inventory', verifyToken, isAdminOrStaff, getInventory);
// router.put('/inventory/:maBienThe/stock', verifyToken, isAdminOrStaff, updateStock);



router.get('/orders',  getAdminOrders);
router.put('/orders/:id/status' ,updateOrderStatus);
router.get('/inventory',  getInventory);
router.put('/inventory/:maBienThe/stock', updateStock);
export default router;