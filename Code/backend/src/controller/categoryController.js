import db from "../config/db.js";

// api lay danh muc san pham
export const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query('SELECT * FROM DANHMUC');
        res.status(200).json({
            message: 'Lấy danh mục thành công',
            data: categories
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};