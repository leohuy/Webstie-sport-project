import db from "../config/db.js";


// 1. Lấy tất cả danh mục (Kèm số lượng sản phẩm đang có trong danh mục đó)
export const getCategories = async (req, res) => {
    try {
        const [categories] = await db.query(`
            SELECT dm.MaDanhMuc, dm.TenDanhMuc, dm.MoTa, 
                   COUNT(sp.MaSanPham) as SoLuongSanPham
            FROM danhmuc dm
            LEFT JOIN sanpham sp ON dm.MaDanhMuc = sp.MaDanhMuc
            GROUP BY dm.MaDanhMuc
            ORDER BY dm.MaDanhMuc DESC
        `);
        res.status(200).json({ message: "Thành công", data: categories });
    } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 2. Thêm danh mục mới
export const createCategory = async (req, res) => {
    try {
        const { tenDanhMuc, moTa } = req.body;
        if (!tenDanhMuc) return res.status(400).json({ message: "Tên danh mục không được để trống!" });

        await db.query('INSERT INTO danhmuc (TenDanhMuc, MoTa) VALUES (?, ?)', [tenDanhMuc, moTa || '']);
        res.status(201).json({ message: "Thêm danh mục thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi thêm danh mục" });
    }
};


// 1. Lấy tất cả thương hiệu
export const getBrands = async (req, res) => {
    try {
        const [brands] = await db.query(`
            SELECT th.MaThuongHieu, th.TenThuongHieu,
                   COUNT(sp.MaSanPham) as SoLuongSanPham
            FROM thuonghieu th
            LEFT JOIN sanpham sp ON th.MaThuongHieu = sp.MaThuongHieu
            GROUP BY th.MaThuongHieu
            ORDER BY th.MaThuongHieu DESC
        `);
        res.status(200).json({ message: "Thành công", data: brands });
    } catch (error) {
        console.error("Lỗi lấy thương hiệu:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

// 2. Thêm thương hiệu mới
export const createBrand = async (req, res) => {
    try {
        const { tenThuongHieu } = req.body;
        if (!tenThuongHieu) return res.status(400).json({ message: "Tên thương hiệu không được để trống!" });

        // Chỉ INSERT mỗi TenThuongHieu
        await db.query('INSERT INTO thuonghieu (TenThuongHieu) VALUES (?)', [tenThuongHieu]);
        res.status(201).json({ message: "Thêm thương hiệu thành công!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi thêm thương hiệu" });
    }
};