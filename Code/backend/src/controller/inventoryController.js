import db from "../config/db.js";

// 1. LẤY DANH SÁCH TỒN KHO (GOM SẢN PHẨM VÀ BIẾN THỂ)
export const getInventory = async (req, res) => {
    try {
        // 1. Lấy danh sách tất cả sản phẩm
        const [products] = await db.query(`
            SELECT sp.MaSanPham, sp.TenSanPham, sp.HinhAnhChinh, sp.TrangThai, 
                   dm.TenDanhMuc, th.TenThuongHieu
            FROM sanpham sp
            LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            LEFT JOIN thuonghieu th ON sp.MaThuongHieu = th.MaThuongHieu
            ORDER BY sp.MaSanPham DESC
        `);

        // 2. Với mỗi sản phẩm, lấy danh sách các Size (Biến thể) của nó
        const inventoryData = await Promise.all(products.map(async (product) => {
            const [variants] = await db.query(`
                SELECT MaBienThe, KichCo, SoLuongTon, GiaBan 
                FROM bienthe_sanpham 
                WHERE MaSanPham = ?
            `, [product.MaSanPham]);

            // Tính tổng số lượng tồn kho của tất cả các size cộng lại
            const tongTonKho = variants.reduce((sum, v) => sum + (v.SoLuongTon || 0), 0);

            return {
                ...product,
                TongTonKho: tongTonKho,
                BienThe: variants // Mảng chứa các size
            };
        }));

        res.status(200).json({
            message: 'Lấy dữ liệu tồn kho thành công',
            data: inventoryData
        });

    } catch (error) {
        console.error("Lỗi lấy tồn kho:", error);
        res.status(500).json({ message: 'Lỗi server khi lấy dữ liệu tồn kho' });
    }
};

// 2. CẬP NHẬT NHANH SỐ LƯỢNG TỒN KHO CỦA 1 SIZE NHẤT ĐỊNH
export const updateStock = async (req, res) => {
    try {
        const { maBienThe } = req.params;
        const { soLuongMoi } = req.body; // Số lượng nhập vào

        if (soLuongMoi < 0) {
            return res.status(400).json({ message: 'Số lượng không được âm' });
        }

        await db.query(
            'UPDATE bienthe_sanpham SET SoLuongTon = ? WHERE MaBienThe = ?',
            [soLuongMoi, maBienThe]
        );

        res.status(200).json({ message: 'Cập nhật số lượng thành công!' });
    } catch (error) {
        console.error("Lỗi cập nhật kho:", error);
        res.status(500).json({ message: 'Lỗi server khi cập nhật kho' });
    }
};