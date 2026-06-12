import db from "../config/db.js";

// 1. LẤY DANH SÁCH TẤT CẢ NGƯỜI DÙNG
export const getAllUsers = async (req, res) => {
    try {
        // Lấy danh sách, ưu tiên xếp Admin/Staff lên đầu
        const [users] = await db.query(`
            SELECT MaNguoiDung, HoTen, Email, SoDienThoai, VaiTro, TrangThai 
            FROM nguoidung 
            ORDER BY 
                CASE VaiTro
                    WHEN 'admin' THEN 1
                    WHEN 'staff' THEN 2
                    ELSE 3
                END, 
                MaNguoiDung DESC
        `);
        res.status(200).json({ message: "Thành công", data: users });
    } catch (error) {
        console.error("Lỗi lấy danh sách người dùng:", error);
        res.status(500).json({ message: "Lỗi server khi tải người dùng" });
    }
};

// 2. CẬP NHẬT VAI TRÒ (PHÂN QUYỀN)
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { vaiTroMoi } = req.body;

        // Ngăn không cho tự hạ quyền của chính mình (Super Admin)
        if (req.user.id == id && vaiTroMoi === 'customer') {
            return res.status(403).json({ message: "Bạn không thể tự giáng chức chính mình!" });
        }

        await db.query('UPDATE nguoidung SET VaiTro = ? WHERE MaNguoiDung = ?', [vaiTroMoi, id]);
        res.status(200).json({ message: "Cập nhật quyền thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi phân quyền" });
    }
};

// 3. KHÓA / MỞ KHÓA TÀI KHOẢN
export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body; // 'HoatDong' hoặc 'BiKhoa'

        // Ngăn không cho khóa chính mình
        if (req.user.id == id) {
            return res.status(403).json({ message: "Bạn không thể tự khóa tài khoản của mình!" });
        }

        await db.query('UPDATE nguoidung SET TrangThai = ? WHERE MaNguoiDung = ?', [trangThaiMoi, id]);
        res.status(200).json({ message: "Cập nhật trạng thái thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi khóa tài khoản" });
    }
};