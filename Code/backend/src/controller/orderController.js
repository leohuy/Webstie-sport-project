import db from "../config/db.js";

// api dat hang
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { tenNguoiNhan, soDienThoai, diaChiChiTiet, phuongThucThanhToan, ghiChu } = req.body;

        // Lấy tất cả sản phẩm 
        const [cartItems] = await db.query(`
            SELECT ct.MaChiTietGH, ct.SoLuong, bt.GiaBan, bt.MaBienThe
            FROM GIOHANG gh
            JOIN CHITIET_GIOHANG ct ON gh.MaGioHang = ct.MaGioHang
            JOIN BIENTHE_SANPHAM bt ON ct.MaBienThe = bt.MaBienThe
            WHERE gh.MaNguoiDung = ?
        `, [userId]);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng của bạn đang trống!' });
        }

        // Tính tiền
        let tongTien = 0;
        cartItems.forEach(item => {
            tongTien += (item.GiaBan * item.SoLuong);
        });

        // Lưu địa chỉ giao hàng vào bảng DIACHI
        const [addrResult] = await db.query(
            'INSERT INTO DIACHI (MaNguoiDung, TenNguoiNhan, SoDienThoaiNhan, DiaChiChiTiet, LaMacDinh) VALUES (?, ?, ?, ?, ?)',
            [userId, tenNguoiNhan, soDienThoai, diaChiChiTiet, false]
        );
        const maDiaChi = addrResult.insertId;

        // Tạo Đơn hàng mới vào bảng DONHANG
        // Tạo Mã tra cứu ngẫu nhiên (Ví dụ: SFX123456)
        const maTraCuu = 'SFX' + Date.now().toString().slice(-6); 
        
        const [orderResult] = await db.query(
            'INSERT INTO DONHANG (MaNguoiDung, MaDiaChi, MaTraCuu, TongTien, PhuongThucThanhToan, GhiChu, TrangThaiDonHang) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, maDiaChi, maTraCuu, tongTien, phuongThucThanhToan, ghiChu, 'ChoXacNhan']
        );
        const maDonHang = orderResult.insertId;

        // Chuyển sản phẩm từ Giỏ hàng sang CHITIET_DONHANG
        for (let item of cartItems) {
            await db.query(
                'INSERT INTO CHITIET_DONHANG (MaDonHang, MaBienThe, SoLuong, GiaLucMua) VALUES (?, ?, ?, ?)',
                [maDonHang, item.MaBienThe, item.SoLuong, item.GiaBan]
            );
        }

        // Xóa sạch giỏ hàng sau khi đặt thành công
        const [cart] = await db.query('SELECT MaGioHang FROM GIOHANG WHERE MaNguoiDung = ?', [userId]);
        await db.query('DELETE FROM CHITIET_GIOHANG WHERE MaGioHang = ?', [cart[0].MaGioHang]);

        res.status(200).json({ 
            message: 'Đặt hàng thành công!', 
            maTraCuu: maTraCuu 
        });

    } catch (error) {
        console.error("Lỗi tạo đơn:", error);
        res.status(500).json({ message: 'Lỗi server khi đặt hàng' });
    }
};