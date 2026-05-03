import db from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// api dang ky nguoi dung
export const register = async (req, res) => {
    try {
        const { hoTen, email, matKhau, soDienThoai } = req.body;

        // Kiểm tra xem email đã tồn tại chưa
        const [existingUsers] = await db.query('SELECT * FROM NGUOIDUNG WHERE Email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email này đã được sử dụng!' });
        }

        // Mã hóa (Băm) mật khẩu với độ khó là 10 (Salt rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(matKhau, salt);

        // Lưu vào CSDL
        const [result] = await db.query(
            'INSERT INTO NGUOIDUNG (HoTen, Email, MatKhau, SoDienThoai, VaiTro) VALUES (?, ?, ?, ?, ?)',
            [hoTen, email, hashedPassword, soDienThoai, 'KhachHang']
        );

        res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


// api dang nhap nguoi dung
export const login = async (req, res) => {
    try {
        const { email, matKhau } = req.body;

        //  Tìm user theo Email
        const [users] = await db.query('SELECT * FROM NGUOIDUNG WHERE Email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' }); // Mã 401 Unauthorized
        }

        const user = users[0];

        // Kiểm tra xem tài khoản có bị khóa không
        if (user.TrangThai === 'BiKhoa') {
            return res.status(403).json({ message: 'Tài khoản của bạn đã bị khóa!' });
        }

        // So sánh mật khẩu người dùng nhập với mật khẩu đã băm trong CSDL
        const isMatch = await bcrypt.compare(matKhau, user.MatKhau);
        if (!isMatch) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
        }

        // Mật khẩu đúng -> Tạo JWT Token
        // Gói những thông tin không nhạy cảm vào Token (Payload)
        const payload = {
            id: user.MaNguoiDung,
            vaiTro: user.VaiTro
        };

        // Ký token, thời hạn sống là 3 ngày 
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3d' });

        //  Trả về cho Frontend
        res.status(200).json({
            message: 'Đăng nhập thành công!',
            token: token,
            user: {
                id: user.MaNguoiDung,
                hoTen: user.HoTen,
                email: user.Email,
                vaiTro: user.VaiTro
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};