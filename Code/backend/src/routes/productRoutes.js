import express from 'express';
import { getAllProducts, getBestSellers } from '../controller/productController.js';

const router = express.Router();

// Lấy tất cả sản phẩm (Có thể có tham số lọc, sắp xếp, tìm kiếm)
router.get('/', getAllProducts);

// Lấy sản phẩm bán chạy
router.get('/best-sellers', getBestSellers);

export default router;