import express from 'express';

import { getUserAddresses ,addAddress, setDefaultAddress, updateProfile, deleteAddress } from '../controller/userController.js';
import { getUserOrders , cancelOrder } from "../controller/orderController.js";
import { verifyToken } from '../middleware/authMiddleware.js';
const router = express.Router();


// Route lấy danh sách địa chỉ 
router.get('/addresses', verifyToken, getUserAddresses);
// route thêm địa chỉ mới cho người dùng
router.post('/addresses', verifyToken, addAddress);
// Route đặt địa chỉ mặc định
router.patch('/addresses/:maDiaChi/default', verifyToken, setDefaultAddress);
// Route cập nhật thông tin người dùng
router.put('/profile', verifyToken, updateProfile);
// Route lấy lịch sử đơn hàng của người dùng
router.get('/orders/history', verifyToken, getUserOrders);

router.put('/orders/:id/cancel', verifyToken, cancelOrder);

router.delete('/addresses/:id', verifyToken, deleteAddress);
export default router;