import db from "../config/db.js";

// api lay danh sach san pham va chuc nang loc/ tim kiem san pham
export const getAllProducts = async (req, res) => {
    try {
        // Lấy các tham số từ URL 
        const { thuongHieu, danhMuc, sort, search } = req.query;

        // Bắt đầu câu query mặc định (Chỉ lấy SP đang Hoạt động)
        let sql = `
            SELECT sp.MaSanPham, sp.TenSanPham, sp.HinhAnhChinh, sp.GiaMacDinh, 
                   dm.TenDanhMuc, th.TenThuongHieu
            FROM SANPHAM sp
            LEFT JOIN DANHMUC dm ON sp.MaDanhMuc = dm.MaDanhMuc
            LEFT JOIN THUONGHIEU th ON sp.MaThuongHieu = th.MaThuongHieu
            WHERE sp.TrangThai = 'HoatDong'
        `;
        let values = [];

        // 1. Xử lý Lọc theo Tìm kiếm tên (Search)
        if (search) {
            sql += ` AND sp.TenSanPham LIKE ?`;
            values.push(`%${search}%`);
        }

        // 2. Xử lý Lọc theo Thương hiệu
        if (thuongHieu) {
            sql += ` AND sp.MaThuongHieu = ?`;
            values.push(thuongHieu);
        }

        // 3. Xử lý Lọc theo Danh mục
        if (danhMuc) {
            sql += ` AND sp.MaDanhMuc = ?`;
            values.push(danhMuc);
        }

        // 4. Xử lý Sắp xếp (Sort)
        if (sort === 'price_asc') {
            sql += ` ORDER BY sp.GiaMacDinh ASC`;
        } else if (sort === 'price_desc') {
            sql += ` ORDER BY sp.GiaMacDinh DESC`;
        } else {
            sql += ` ORDER BY sp.MaSanPham DESC`; // Mặc định: Mới nhất
        }

        // Thực thi truy vấn
        const [products] = await db.query(sql, values);

        res.status(200).json({
            message: 'Lấy danh sách sản phẩm thành công!',
            total: products.length,
            data: products
        });

    } catch (error) {
        console.error('Lỗi khi lấy SP:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
