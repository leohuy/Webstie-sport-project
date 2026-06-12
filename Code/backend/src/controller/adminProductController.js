import db from "../config/db.js";

// API THÊM SẢN PHẨM MỚI KÈM CÁC SIZE & ẢNH PHỤ
export const createProduct = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction(); // Bắt đầu chuỗi giao dịch an toàn

        const { tenSanPham, maDanhMuc, maThuongHieu, moTa, giaBanChung, hinhAnhChinh, bienThe, hinhAnhPhu } = req.body;

        // Kiểm tra dữ liệu cơ bản
        if (!tenSanPham || !giaBanChung) {
            return res.status(400).json({ message: "Vui lòng nhập Tên sản phẩm và Giá bán!" });
        }

        // 1. Thêm thông tin chung vào bảng SANPHAM
        const [productResult] = await connection.query(
            `INSERT INTO sanpham (TenSanPham, MaDanhMuc, MaThuongHieu, MoTa, GiaMacDinh, HinhAnhChinh, TrangThai)
             VALUES (?, ?, ?, ?, ?, ?, 'HoatDong')`,
            [tenSanPham, maDanhMuc || null, maThuongHieu || null, moTa || '', giaBanChung, hinhAnhChinh || 'default_product.jpg']
        );
        const newProductId = productResult.insertId;
        // 🌟 2. XỬ LÝ LƯU ẢNH PHỤ (Đã sửa lỗi Transaction)
        if (hinhAnhPhu && hinhAnhPhu.length > 0) {
            // [ [1, 'anh1.jpg'], [1, 'anh2.jpg'] ]
            const imageValues = hinhAnhPhu.map(link => [newProductId, link]);

            // LƯU Ý: Dùng connection.query thay vì db.query
            // Chú ý: Hãy chắc chắn cột trong Database của bạn tên là DuongDan hay DuongDanAnh nhé
            await connection.query('INSERT INTO hinhanh_sanpham (MaSanPham, DuongDanAnh) VALUES ?', [imageValues]);
        }

        // 3. Thêm các phân loại Kích cỡ (Size) vào bảng BIENTHE_SANPHAM
        if (bienThe && bienThe.length > 0) {
            for (let bt of bienThe) {
                await connection.query(
                    `INSERT INTO bienthe_sanpham (MaSanPham, KichCo, GiaBan, SoLuongTon)
                     VALUES (?, ?, ?, ?)`,
                    [newProductId, bt.kichCo, bt.giaBan || giaBanChung, bt.soLuongTon || 0]
                );
            }
        } else {
            await connection.query(
                `INSERT INTO bienthe_sanpham (MaSanPham, KichCo, GiaBan, SoLuongTon)
                 VALUES (?, 'Freesize', ?, 0)`,
                [newProductId, giaBanChung]
            );
        }

        await connection.commit(); // Xác nhận hoàn tất lưu vào Database
        res.status(201).json({ message: "Đăng tải sản phẩm thành công!", productId: newProductId });

    } catch (error) {
        await connection.rollback(); // Lùi lại xóa hết nếu lỗi
        console.error("Lỗi thêm sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server khi lưu dữ liệu sản phẩm" });
    } finally {
        connection.release(); // Trả lại kết nối
    }
};


// API LẤY DANH SÁCH SẢN PHẨM (KÈM TÊN DANH MỤC VÀ THƯƠNG HIỆU)
export const getProducts = async (req, res) => {
    try {
        const [products] = await db.query(`
            SELECT sp.MaSanPham, sp.TenSanPham, sp.HinhAnhChinh, sp.TrangThai,
                   dm.TenDanhMuc, th.TenThuongHieu,
                     (SELECT MIN(GiaBan) FROM bienthe_sanpham WHERE MaSanPham = sp.MaSanPham) AS GiaThapNhat
                 FROM sanpham sp
                 LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
                 LEFT JOIN thuonghieu th ON sp.MaThuongHieu = th.MaThuongHieu
            ORDER BY sp.MaSanPham DESC
        `);

        res.status(200).json({
            message: "Lấy danh sách sản phẩm thành công",
            data: products
        });
    } catch (error) {
        console.error("Lỗi lấy danh sách sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server khi tải danh sách sản phẩm" });
    }
};


// API LẤY CHI TIẾT 1 SẢN PHẨM ĐỂ HIỂN THỊ LÊN TRANG CHỦ/DETAILS
export const getProductDetailPublic = async (req, res) => {
    try {
        const { id } = req.params;

        // 1. Lấy thông tin chung của sản phẩm
        const [[product]] = await db.query(`
            SELECT sp.*, dm.TenDanhMuc, th.TenThuongHieu
            FROM sanpham sp
            LEFT JOIN danhmuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
            LEFT JOIN thuonghieu th ON sp.MaThuongHieu = th.MaThuongHieu
            WHERE sp.MaSanPham = ? AND sp.TrangThai = 'HoatDong'
        `, [id]);

        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tồn tại hoặc đã bị ẩn!" });
        }

        // 2. Lấy tất cả các Size
        const [variants] = await db.query(`
            SELECT MaBienThe, KichCo, GiaBan, SoLuongTon 
            FROM bienthe_sanpham 
            WHERE MaSanPham = ?
        `, [id]);

        // 3. LẤY MẢNG ẢNH PHỤ
        const [extraImages] = await db.query('SELECT DuongDanAnh FROM hinhanh_sanpham WHERE MaSanPham = ?', [id]);

        res.status(200).json({
            message: "Lấy chi tiết sản phẩm thành công",
            data: {
                ...product,
                bienThe: variants,
                HinhAnhPhu: extraImages.map(img => img.DuongDanAnh) // Đóng gói thành mảng URL
            }
        });
    } catch (error) {
        console.error("Lỗi lấy chi tiết sản phẩm:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};