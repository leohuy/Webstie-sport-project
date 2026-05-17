
import db from '../config/db.js';


// api them san pham vao gio hang
export const addToCart = async (req, res) => {
    try {
        const userId = req.user.id; // Lấy từ authMiddleware
        const { maBienThe, soLuong = 1 } = req.body;

        // Tìm hoặc Tạo Giỏ Hàng cho User này
        let [carts] = await db.query('SELECT MaGioHang FROM GIOHANG WHERE MaNguoiDung = ?', [userId]);
        let maGioHang;

        if (carts.length === 0) {
            // Nếu chưa có, tạo giỏ hàng mới
            const [newCart] = await db.query('INSERT INTO GIOHANG (MaNguoiDung) VALUES (?)', [userId]);
            maGioHang = newCart.insertId;
        } else {
            maGioHang = carts[0].MaGioHang;
        }

        // Kiểm tra xem Biến thể sản phẩm này đã có trong Chi tiết giỏ hàng chưa
        const [cartItems] = await db.query(
            'SELECT * FROM CHITIET_GIOHANG WHERE MaGioHang = ? AND MaBienThe = ?',
            [maGioHang, maBienThe]
        );

        if (cartItems.length > 0) {
            // Đã có -> Tăng số lượng
            await db.query(
                'UPDATE CHITIET_GIOHANG SET SoLuong = SoLuong + ? WHERE MaChiTietGH = ?',
                [soLuong, cartItems[0].MaChiTietGH]
            );
        } else {
            // Chưa có -> Thêm mới
            await db.query(
                'INSERT INTO CHITIET_GIOHANG (MaGioHang, MaBienThe, SoLuong) VALUES (?, ?, ?)',
                [maGioHang, maBienThe, soLuong]
            );
        }

        res.status(200).json({ message: 'Đã thêm vào giỏ hàng!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


// api lay thong tin gio hang
export const getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const sql = `
            SELECT ct.MaChiTietGH, ct.SoLuong, bt.KichCo, bt.GiaBan, 
                   sp.TenSanPham, sp.HinhAnhChinh, th.TenThuongHieu
            FROM GIOHANG gh
            JOIN CHITIET_GIOHANG ct ON gh.MaGioHang = ct.MaGioHang
            JOIN BIENTHE_SANPHAM bt ON ct.MaBienThe = bt.MaBienThe
            JOIN SANPHAM sp ON bt.MaSanPham = sp.MaSanPham
            LEFT JOIN THUONGHIEU th ON sp.MaThuongHieu = th.MaThuongHieu
            WHERE gh.MaNguoiDung = ?
        `;
        const [cartItems] = await db.query(sql, [userId]);
        
        res.status(200).json({ data: cartItems });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// api cap nhat so luong san pham trong gio hang
export const updateCartItem = async (req, res) => {
    try {
        const { maChiTietGH, soLuong } = req.body;
        await db.query('UPDATE CHITIET_GIOHANG SET SoLuong = ? WHERE MaChiTietGH = ?', [soLuong, maChiTietGH]);
        res.status(200).json({ message: 'Đã cập nhật số lượng' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// api xoa san pham khoi gio hang
export const removeCartItem = async (req, res) => {
    try {
        const { maChiTietGH } = req.params;
        await db.query('DELETE FROM CHITIET_GIOHANG WHERE MaChiTietGH = ?', [maChiTietGH]);
        res.status(200).json({ message: 'Đã xóa sản phẩm khỏi giỏ' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server' });
    }
};