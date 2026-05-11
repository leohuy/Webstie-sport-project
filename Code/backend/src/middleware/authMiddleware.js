import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    // Lấy token từ header 'Authorization: Bearer <token>'
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện chức năng này!' });
    }

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Gắn thông tin user (gồm id, vaiTro) vào request
        next(); // Cho phép đi tiếp vào Controller
    } catch (error) {
        return res.status(403).json({ message: 'Phiên đăng nhập hết hạn hoặc không hợp lệ!' });
    }
};

