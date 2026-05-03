import express from 'express';
import { getAllProducts } from '../controller/productController.js';

const router = express.Router();

// Lấy tất cả sản phẩm (Có thể có tham số lọc, sắp xếp, tìm kiếm)
router.get('/', getAllProducts);

export default router;