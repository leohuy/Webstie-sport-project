import db from "../config/db.js";

// 1. LẤY DANH SÁCH ĐƠN HÀNG DÀNH CHO ADMIN VÀ STAFF
export const getAdminOrders = async (req, res) => {
    try {
        const { status, search } = req.query;

        // Đã đổi tên cột thành TrangThaiDonHang (dùng AS TrangThai để Frontend dễ đọc)
        let sql = `
            SELECT dh.MaDonHang, dh.NgayDat, dh.TongTien, dh.TrangThaiDonHang AS TrangThai, dh.PhuongThucThanhToan,
                   nd.HoTen, nd.SoDienThoai
            FROM DONHANG dh
            LEFT JOIN NGUOIDUNG nd ON dh.MaNguoiDung = nd.MaNguoiDung
            WHERE 1=1
        `;
        let values = [];

        // Lọc theo Trạng thái
        if (status) {
            sql += ` AND dh.TrangThaiDonHang = ?`;
            values.push(status);
        }

        // Lọc theo Từ khóa tìm kiếm
        if (search) {
            sql += ` AND (nd.HoTen LIKE ? OR dh.MaDonHang = ?)`;
            values.push(`%${search}%`, search);
        }

        sql += ` ORDER BY dh.NgayDat DESC`;

        const [orders] = await db.query(sql, values);

        res.status(200).json({
            message: 'Lấy danh sách đơn hàng thành công!',
            data: orders
        });

    } catch (error) {
        console.error('Lỗi lấy đơn hàng admin:', error);
        res.status(500).json({ message: 'Lỗi server khi tải dữ liệu đơn hàng' });
    }
};

// 2. CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Duyệt đơn / Giao hàng / Hủy đơn)
export const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { trangThaiMoi } = req.body;

        const validStatuses = ['ChoXacNhan', 'DangGiao', 'DaGiao', 'DaHuy'];
        if (!validStatuses.includes(trangThaiMoi)) {
            return res.status(400).json({ message: 'Trạng thái chuyển đổi không hợp lệ' });
        }

        // Đã đổi thành TrangThaiDonHang
        const [result] = await db.query(
            'UPDATE DONHANG SET TrangThaiDonHang = ? WHERE MaDonHang = ?',
            [trangThaiMoi, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng yêu cầu' });
        }

        res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công!' });

    } catch (error) {
        console.error('Lỗi cập nhật trạng thái đơn:', error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật trạng thái đơn' });
    }
};