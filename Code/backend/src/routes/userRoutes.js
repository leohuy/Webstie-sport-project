import express from 'express';

import { getUserAddresses ,addAddress, setDefaultAddress, updateProfile } from '../controller/userController.js';
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
export default router;