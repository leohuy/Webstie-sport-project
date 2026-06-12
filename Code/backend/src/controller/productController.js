import db from "../config/db.js";

// api lay danh sach san pham va chuc nang loc/ tim kiem san pham
export const getAllProducts = async (req, res) => {
    try {
        // 1. Nhận THÊM các tham số brands, minPrice, maxPrice, sizes từ URL
        const { danhMuc, sort, search, brands, minPrice, maxPrice, sizes } = req.query;

        // Bắt đầu câu query mặc định (Chỉ lấy SP đang Hoạt động)
        let sql = `
            SELECT sp.MaSanPham, sp.TenSanPham, sp.HinhAnhChinh, sp.GiaMacDinh, 
                dm.TenDanhMuc, th.TenThuongHieu,
                (SELECT MaBienThe FROM bienthe_sanpham WHERE MaSanPham = sp.MaSanPham LIMIT 1) as MaBienThe
            FROM sanpham sp
            LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            LEFT JOIN thuonghieu th ON sp.MaThuongHieu = th.MaThuongHieu
            WHERE sp.TrangThai = 'HoatDong'
        `;
        let values = [];

        // 2. Xử lý Lọc theo Tìm kiếm tên (Search)
        if (search) {
            sql += ` AND sp.TenSanPham LIKE ?`;
            values.push(`%${search}%`);
        }

        // 3. Xử lý Lọc theo Danh mục
        if (danhMuc) {
            sql += ` AND sp.MaDanhMuc = ?`;
            values.push(danhMuc);
        }

        // 4. Xử lý Lọc theo Thương hiệu (Frontend gửi "Nike,Adidas")
        if (brands) {
            const brandArray = brands.split(',');
            sql += ` AND th.TenThuongHieu IN (?)`;
            values.push(brandArray); // Truyền nguyên mảng vào, thư viện mysql2 sẽ tự xử lý
        }

        // 5. Xử lý Lọc theo Khoảng giá
        if (minPrice) {
            sql += ` AND sp.GiaMacDinh >= ?`;
            values.push(Number(minPrice));
        }
        if (maxPrice) {
            sql += ` AND sp.GiaMacDinh <= ?`;
            values.push(Number(maxPrice));
        }

        // 6. Xử lý Lọc theo Kích cỡ (Dùng EXISTS để tránh bị lặp sản phẩm)
        if (sizes) {
            const sizeArray = sizes.split(',');
            sql += ` AND EXISTS (SELECT 1 FROM bienthe_sanpham bt WHERE bt.MaSanPham = sp.MaSanPham AND bt.KichCo IN (?))`;
            values.push(sizeArray);
        }

        // 7. Xử lý Sắp xếp (Sort)
        if (sort === 'price_asc') {
            sql += ` ORDER BY sp.GiaMacDinh ASC`;
        } else if (sort === 'price_desc') {
            sql += ` ORDER BY sp.GiaMacDinh DESC`;
        } else if (sort === 'bestseller') {
            sql += ` ORDER BY sp.MaSanPham ASC`; // Tạm dùng mã tăng dần cho Bán chạy
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

// api lay danh sach san pham noi bat (index.html)
export const getBestSellers = async (req, res) => {
    try {

        const sql = `
    SELECT sp.MaSanPham, sp.TenSanPham, sp.HinhAnhChinh, sp.GiaMacDinh,
            (SELECT MaBienThe FROM bienthe_sanpham WHERE MaSanPham = sp.MaSanPham LIMIT 1) as MaBienThe
        FROM sanpham sp
    WHERE sp.TrangThai = 'HoatDong'
    ORDER BY sp.MaSanPham ASC 
    LIMIT 10
`;
        const [products] = await db.query(sql);

        res.status(200).json({
            message: 'Lấy sản phẩm bán chạy thành công!',
            data: products
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};


// api lay chi tiet san pham theo MaSanPham
// export const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;

//         //  Lấy thông tin chung của Sản phẩm
//         const [products] = await db.query(`
//             SELECT sp.*, th.TenThuongHieu, dm.TenDanhMuc
//             FROM sanpham sp
//             LEFT JOIN thuonghieu th ON sp.MaThuongHieu = th.MaThuongHieu
//             LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
//             WHERE sp.MaSanPham = ?
//         `, [id]);

//         if (products.length === 0) {
//             return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
//         }

//         // Lấy danh sách các Kích cỡ (Biến thể)
//         const [variants] = await db.query('SELECT * FROM bienthe_sanpham WHERE MaSanPham = ?', [id]);

//         // Đóng gói trả về
//         res.status(200).json({
//             message: 'Lấy chi tiết sản phẩm thành công',
//             data: {
//                 ...products[0],
//                 bienThe: variants
//             }
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Lỗi server' });
//     }
// };

// api lay chi tiet san pham theo MaSanPham
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Lấy thông tin chung của Sản phẩm
        const [products] = await db.query(`
            SELECT sp.*, th.TenThuongHieu, dm.TenDanhMuc
            FROM sanpham sp
            LEFT JOIN thuonghieu th ON sp.MaThuongHieu = th.MaThuongHieu
            LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            WHERE sp.MaSanPham = ?
        `, [id]);

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // 2. Lấy danh sách các Kích cỡ (Biến thể)
        const [variants] = await db.query('SELECT * FROM bienthe_sanpham WHERE MaSanPham = ?', [id]);

        // 3. 🌟 LẤY DANH SÁCH ẢNH PHỤ (MỚI THÊM) 🌟
        const [extraImages] = await db.query('SELECT DuongDanAnh FROM hinhanh_sanpham WHERE MaSanPham = ?', [id]);

        // Đóng gói trả về
        res.status(200).json({
            message: 'Lấy chi tiết sản phẩm thành công',
            data: {
                ...products[0],
                bienThe: variants,
                HinhAnhPhu: extraImages.map(img => img.DuongDanAnh) // Trả về mảng link ảnh [ 'anh1.jpg', 'anh2.jpg' ]
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server' });
    }
};


// 1. API LẤY DANH SÁCH ĐÁNH GIÁ CỦA 1 SẢN PHẨM
export const getProductReviews = async (req, res) => {
    try {
        const { id } = req.params; // Mã sản phẩm
        const [reviews] = await db.query(`
            SELECT dg.*, nd.HoTen 
            FROM danhgia dg
            JOIN nguoidung nd ON dg.MaNguoiDung = nd.MaNguoiDung
            WHERE dg.MaSanPham = ?
            ORDER BY dg.NgayDanhGia DESC
        `, [id]);

        res.status(200).json({ data: reviews });
    } catch (error) {
        console.error("Lỗi lấy đánh giá:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 2. API THÊM ĐÁNH GIÁ (CÓ KIỂM TRA ĐÃ MUA HÀNG CHƯA)
export const addReview = async (req, res) => {
    try {
        const userId = req.user.id; 
        const { id } = req.params;  
        const { diemSo, binhLuan } = req.body; // Nhận biến binhLuan từ Frontend

        if (!diemSo || diemSo < 1 || diemSo > 5) {
            return res.status(400).json({ message: "Vui lòng chọn số sao từ 1 đến 5!" });
        }

        // KIỂM TRA ĐÃ MUA HÀNG CHƯA
        const [checkPurchase] = await db.query(`
            SELECT 1 FROM donhang dh
            JOIN chitiet_donhang ct ON dh.MaDonHang = ct.MaDonHang
            JOIN bienthe_sanpham bt ON ct.MaBienThe = bt.MaBienThe
            WHERE dh.MaNguoiDung = ? 
              AND bt.MaSanPham = ? 
              AND dh.TrangThaiDonHang = 'DaGiao'
            LIMIT 1
        `, [userId, id]);

        if (checkPurchase.length === 0) {
            return res.status(403).json({ message: "Bạn phải mua và nhận sản phẩm này mới được đánh giá!" });
        }

        // Đã mua -> Cho phép lưu đánh giá (Sử dụng BinhLuan và NgayDanhGia)
        await db.query(`
            INSERT INTO danhgia (MaSanPham, MaNguoiDung, DiemSo, BinhLuan, NgayDanhGia) 
            VALUES (?, ?, ?, ?, NOW())
        `, [id, userId, diemSo, binhLuan || '']);

        res.status(201).json({ message: "Cảm ơn bạn đã đánh giá sản phẩm!" });

    } catch (error) {
        console.error("Lỗi thêm đánh giá:", error);
        res.status(500).json({ message: "Lỗi server khi thêm đánh giá" });
    }
};