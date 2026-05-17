import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import db from './config/db.js';
// Import các routes
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config({ path: fileURLToPath(new URL('./.env', import.meta.url)) });
const app = express();

// Middlewares
app.use(cors()); // Cho phép Frontend gọi API
app.use(express.json()); // Đọc dữ liệu JSON gửi từ Client

// Routes
app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.use('/api/cart', cartRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/user', userRoutes);

app.use("/api/admin", adminRoutes);
// Khởi chạy server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(` Server Backend đang chạy tại: http://localhost:${PORT}`);
});