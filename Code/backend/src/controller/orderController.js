import db from "../config/db.js";

// api dat hang
export const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        // Bắt thêm tham số buyNowItem từ Frontend gửi lên
        const { maDiaChi, phuongThucThanhToan, ghiChu, buyNowItem } = req.body;

        if (!maDiaChi) return res.status(400).json({ message: 'Vui lòng chọn địa chỉ giao hàng!' });
        let itemsToOrder = [];
        let tongTien = 0;

        // 1. KIỂM TRA CHẾ ĐỘ MUA
        if (buyNowItem) {
            // Chế độ "Mua Ngay": Chỉ lấy thông tin của 1 sản phẩm này
            const [variantInfo] = await db.query('SELECT GiaBan FROM BIENTHE_SANPHAM WHERE MaBienThe = ?', [buyNowItem.maBienThe]);
            itemsToOrder = [{
                MaBienThe: buyNowItem.maBienThe,
                SoLuong: buyNowItem.soLuong,
                GiaBan: variantInfo[0].GiaBan
            }];
            tongTien = itemsToOrder[0].GiaBan * itemsToOrder[0].SoLuong;
        } else {
            // Chế độ "Giỏ Hàng": Lấy toàn bộ từ CSDL như cũ
            const [cartItems] = await db.query(`
                SELECT ct.MaChiTietGH, ct.SoLuong, bt.GiaBan, bt.MaBienThe
                FROM GIOHANG gh
                JOIN CHITIET_GIOHANG ct ON gh.MaGioHang = ct.MaGioHang
                JOIN BIENTHE_SANPHAM bt ON ct.MaBienThe = bt.MaBienThe
                WHERE gh.MaNguoiDung = ?
            `, [userId]);

            if (cartItems.length === 0) return res.status(400).json({ message: 'Giỏ hàng của bạn đang trống!' });

            itemsToOrder = cartItems;
            cartItems.forEach(item => { tongTien += (item.GiaBan * item.SoLuong); });
        }

        //const maDiaChi = addrResult.insertId;
        const maTraCuu = 'SFX' + Date.now().toString().slice(-6);
        const [orderResult] = await db.query(
            'INSERT INTO DONHANG (MaNguoiDung, MaDiaChi, MaTraCuu, TongTien, PhuongThucThanhToan, GhiChu, TrangThaiDonHang) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [userId, maDiaChi, maTraCuu, tongTien, phuongThucThanhToan, ghiChu, 'ChoXacNhan']
        );
        const maDonHang = orderResult.insertId;

        //  THÊM CHI TIẾT ĐƠN HÀNG
        for (let item of itemsToOrder) {
            await db.query(
                'INSERT INTO CHITIET_DONHANG (MaDonHang, MaBienThe, SoLuong, GiaLucMua) VALUES (?, ?, ?, ?)',
                [maDonHang, item.MaBienThe, item.SoLuong, item.GiaBan]
            );
        }

        //  XÓA GIỎ HÀNG 
        if (!buyNowItem) {
            const [cart] = await db.query('SELECT MaGioHang FROM GIOHANG WHERE MaNguoiDung = ?', [userId]);
            if (cart.length > 0) {
                await db.query('DELETE FROM CHITIET_GIOHANG WHERE MaGioHang = ?', [cart[0].MaGioHang]);
            }
        }

        res.status(200).json({ message: 'Đặt hàng thành công!', maTraCuu: maTraCuu });
    } catch (error) {
        console.error("Lỗi tạo đơn:", error);
        res.status(500).json({ message: 'Lỗi server khi đặt hàng' });
    }
};
// api lấy lịch sử đơn hàng
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ Token

        // 1. Lấy danh sách đơn hàng
        const [orders] = await db.query(`
            SELECT dh.*, dc.DiaChiChiTiet 
            FROM DONHANG dh
            JOIN DIACHI dc ON dh.MaDiaChi = dc.MaDiaChi
            WHERE dh.MaNguoiDung = ?
            ORDER BY dh.NgayDat DESC
        `, [userId]);

        // 2. Với mỗi đơn hàng, lấy thêm danh sách sản phẩm trong đơn đó
        // (Đây là cách làm chi tiết để hiện ảnh sản phẩm ra lịch sử)
        const ordersWithDetails = await Promise.all(orders.map(async (order) => {
            const [details] = await db.query(`
                SELECT ct.*, sp.TenSanPham, sp.HinhAnhChinh, bt.KichCo
                FROM CHITIET_DONHANG ct
                JOIN BIENTHE_SANPHAM bt ON ct.MaBienThe = bt.MaBienThe
                JOIN SANPHAM sp ON bt.MaSanPham = sp.MaSanPham
                WHERE ct.MaDonHang = ?
            `, [order.MaDonHang]);

            return { ...order, sanPham: details };
        }));

        res.status(200).json({
            message: 'Lấy lịch sử đơn hàng thành công',
            data: ordersWithDetails
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};