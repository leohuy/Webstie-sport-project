import db from "../config/db.js";

export const getDashboardStats = async (req, res) => {
    try {
        // 1. Tổng doanh thu (Cộng tất cả đơn hàng KHÔNG bị hủy)
        const [[revenueResult]] = await db.query(
            "SELECT SUM(TongTien) as total FROM donhang WHERE TrangThaiDonHang != 'DaHuy'"
        );
        const totalRevenue = revenueResult.total || 0;

        // 2. Tổng số khách hàng đăng ký
        const [[usersResult]] = await db.query(
            "SELECT COUNT(*) as total FROM nguoidung WHERE VaiTro = 'customer'"
        );
        const totalUsers = usersResult.total || 0;

        // 3. Tổng số đơn hàng đã đặt
        const [[ordersResult]] = await db.query(
            "SELECT COUNT(*) as total FROM donhang"
        );
        const totalOrders = ordersResult.total || 0;

        // 4. Tổng số sản phẩm đang có trong hệ thống
        const [[productsResult]] = await db.query(
            "SELECT COUNT(*) as total FROM sanpham"
        );
        const totalProducts = productsResult.total || 0;

        // 5. Lấy danh sách 4 khách hàng mới nhất (Để hiển thị ở góc dưới bên phải)
        // Lưu ý: Đảm bảo bảng NGUOIDUNG của bạn có cột Email hoặc tương đương
        const [recentUsers] = await db.query(
            "SELECT HoTen, Email FROM nguoidung WHERE VaiTro = 'customer' ORDER BY MaNguoiDung DESC LIMIT 4"
        );

        // Trả toàn bộ dữ liệu về cho Frontend
        res.status(200).json({
            message: "Lấy thống kê thành công",
            data: {
                totalRevenue,
                totalUsers,
                totalOrders,
                totalProducts,
                recentUsers
            }
        });
    } catch (error) {
        console.error("Lỗi lấy dữ liệu dashboard:", error);
        res.status(500).json({ message: "Lỗi server khi tính toán thống kê" });
    }
};