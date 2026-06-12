import express from 'express';
import { addToCart, getCart, updateCartItem, removeCartItem } from '../controller/cartController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// api thêm sản phẩm vào giỏ hàng
router.post('/add', verifyToken, addToCart);
// api lấy thông tin giỏ hàng
router.get('/', verifyToken, getCart);
// api cập nhật số lượng sản phẩm trong giỏ hàng
router.put('/update', verifyToken, updateCartItem);
// api xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:maChiTietGH', verifyToken, removeCartItem);

export default router;