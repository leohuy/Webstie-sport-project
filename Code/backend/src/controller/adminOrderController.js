import db from "../config/db.js";

// 1. LẤY DANH SÁCH ĐƠN HÀNG DÀNH CHO ADMIN VÀ STAFF
export const getAdminOrders = async (req, res) => {
    try {
        const { status, search } = req.query;

        // Đã đổi tên cột thành TrangThaiDonHang (dùng AS TrangThai để Frontend dễ đọc)
        let sql = `
            SELECT dh.MaDonHang, dh.NgayDat, dh.TongTien, dh.TrangThaiDonHang AS TrangThai, dh.PhuongThucThanhToan,
                   nd.HoTen, nd.SoDienThoai
            FROM donhang dh
            LEFT JOIN nguoidung nd ON dh.MaNguoiDung = nd.MaNguoiDung
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
            'UPDATE donhang SET TrangThaiDonHang = ? WHERE MaDonHang = ?',
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

// LẤY CHI TIẾT 1 ĐƠN HÀNG (Bao gồm các món đồ khách mua)
export const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params; // Lấy Mã đơn hàng từ URL

        // 1. Lấy thông tin chung của đơn hàng và địa chỉ giao hàng
        const [[orderInfo]] = await db.query(`
            SELECT dh.*, nd.HoTen, nd.SoDienThoai, nd.Email,
                   dc.TenNguoiNhan, dc.SoDienThoaiNhan, dc.DiaChiChiTiet
            FROM donhang dh
            LEFT JOIN nguoidung nd ON dh.MaNguoiDung = nd.MaNguoiDung
            LEFT JOIN diachi dc ON dh.MaDiaChi = dc.MaDiaChi
            WHERE dh.MaDonHang = ?
        `, [id]);

        if (!orderInfo) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng!' });
        }

        // 2. Lấy danh sách các sản phẩm (chi tiết) nằm trong đơn hàng đó
        const [orderItems] = await db.query(`
            SELECT ct.SoLuong, ct.GiaLucMua, 
                   bt.KichCo, sp.TenSanPham, sp.HinhAnhChinh
            FROM chitiet_donhang ct
            JOIN bienthe_sanpham bt ON ct.MaBienThe = bt.MaBienThe
            JOIN sanpham sp ON bt.MaSanPham = sp.MaSanPham
            WHERE ct.MaDonHang = ?
        `, [id]);

        res.status(200).json({
            message: 'Lấy chi tiết đơn hàng thành công',
            data: {
                thongTinChung: orderInfo,
                danhSachSanPham: orderItems
            }
        });

    } catch (error) {
        console.error('Lỗi lấy chi tiết đơn hàng:', error);
        res.status(500).json({ message: 'Lỗi server khi tải chi tiết đơn' });
    }
};

// API LẤY DỮ LIỆU THỐNG KÊ CHO ADMIN DASHBOARD
export const getDashboardStats = async (req, res) => {
    try {
        // 1. Tính tổng doanh thu (Chỉ cộng tiền những đơn 'DaGiao')
        const [[revenueResult]] = await db.query(`
            SELECT SUM(TongTien) as TongDoanhThu 
            FROM donhang 
            WHERE TrangThaiDonHang = 'DaGiao'
        `);

        // 2. Tính tổng số đơn hàng đã đặt
        const [[orderResult]] = await db.query(`
            SELECT COUNT(MaDonHang) as TongDonHang 
            FROM donhang
        `);

        // 3. Lấy doanh thu theo từng tháng (Vẽ biểu đồ 6 tháng gần nhất)
        // Chú ý: Cột ngày tháng của bạn tên là NgayDat hay NgayTao thì nhớ đổi cho khớp nhé
        const [chartData] = await db.query(`
            SELECT 
                DATE_FORMAT(NgayDat, '%m/%Y') as Thang, 
                SUM(TongTien) as DoanhThu
            FROM donhang
            WHERE TrangThaiDonHang = 'DaGiao' 
              AND NgayDat >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(NgayDat, '%m/%Y')
            ORDER BY MIN(NgayDat) ASC
        `);

        // Trả kết quả về cho Frontend
        res.status(200).json({
            message: "Lấy thống kê thành công",
            data: {
                tongDoanhThu: revenueResult.TongDoanhThu || 0,
                tongDonHang: orderResult.TongDonHang || 0,
                bieuDo: chartData // Mảng: [{ Thang: "04/2026", DoanhThu: 5000000 }, ...]
            }
        });

    } catch (error) {
        console.error("Lỗi lấy dữ liệu thống kê:", error);
        res.status(500).json({ message: "Lỗi server khi tính toán thống kê" });
    }
};
