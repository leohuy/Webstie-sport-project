import express from 'express';
import { getAllProducts, getBestSellers, getProductById, getProductReviews,addReview } from '../controller/productController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lấy tất cả sản phẩm (Có thể có tham số lọc, sắp xếp, tìm kiếm)
router.get('/', getAllProducts);

// Lấy sản phẩm bán chạy
router.get('/best-sellers', getBestSellers);

// lay chi tiet san pham theo id
router.get('/:id',getProductById);


router.get('/:id/reviews', getProductReviews);

// 2. Viết đánh giá (Bắt buộc phải đăng nhập -> verifyToken)
router.post('/:id/reviews', verifyToken, addReview);
export default router;