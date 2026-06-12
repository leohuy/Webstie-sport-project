import db from "../config/db.js";
//Hàm lấy danh sách địa chỉ của người dùng
export const getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy ID người dùng từ verifyToken

        const [addresses] = await db.query(
            'SELECT * FROM diachi WHERE MaNguoiDung = ? ORDER BY LaMacDinh DESC, MaDiaChi DESC',
            [userId]
        );

        res.status(200).json({
            message: 'Lấy danh sách địa chỉ thành công',
            data: addresses
        });
    } catch (error) {
        console.error("Lỗi lấy địa chỉ:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy địa chỉ' });
    }
};
// Hàm thêm địa chỉ mới cho người dùng
export const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tenNguoiNhan, soDienThoai, diaChiChiTiet } = req.body;

        // Lưu vào bảng DIACHI
        const [result] = await db.query(
            'INSERT INTO diachi (MaNguoiDung, TenNguoiNhan, SoDienThoaiNhan, DiaChiChiTiet, LaMacDinh) VALUES (?, ?, ?, ?, ?)',
            [userId, tenNguoiNhan, soDienThoai, diaChiChiTiet, true] // Tạm set mặc định là true cho dễ
        );

        res.status(200).json({
            message: 'Thêm địa chỉ thành công!',
            maDiaChi: result.insertId
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi lưu địa chỉ' });
    }
};
// Hàm đặt địa chỉ mặc định
export const setDefaultAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { maDiaChi } = req.params;

        // Bỏ mặc định tất cả các địa chỉ cũ của user này
        await db.query('UPDATE diachi SET LaMacDinh = 0 WHERE MaNguoiDung = ?', [userId]);
        // Set mặc định cho cái mới chọn
        await db.query('UPDATE diachi SET LaMacDinh = 1 WHERE MaDiaChi = ? AND MaNguoiDung = ?', [maDiaChi, userId]);

        res.status(200).json({ message: 'Đã cập nhật địa chỉ mặc định!' });
    } catch (error) { res.status(500).json({ message: 'Lỗi server' }); }
};
// ham cap nhat thong tin nguoi dung
export const updateProfile = async (req, res) => {
    try {
        // Lấy ID người dùng đang đăng nhập từ Token
        const userId = req.user.id; 
        
        // Lấy tên và sđt mới do Frontend gửi lên
        const { hoTen, soDienThoai } = req.body; 

        // Chạy lệnh SQL để cập nhật vào bảng NGUOIDUNG
        await db.query(
            'UPDATE nguoidung SET HoTen = ?, SoDienThoai = ? WHERE MaNguoiDung = ?',
            [hoTen, soDienThoai, userId]
        );

        res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
    } catch (error) {
        console.error("Lỗi cập nhật profile:", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật thông tin' });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params; // MaDiaChi
        const userId = req.user.id;

        await db.query('DELETE FROM diachi WHERE MaDiaChi = ? AND MaNguoiDung = ?', [id, userId]);
        res.status(200).json({ message: "Xóa địa chỉ thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi xóa địa chỉ" });
    }
};