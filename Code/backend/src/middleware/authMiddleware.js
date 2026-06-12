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

// Middleware kiểm tra xem người dùng có phải là Admin hoặc Staff không
export const isAdminOrStaff = (req, res, next) => {
    // req.user đã được hàm verifyToken bổ sung vào trước đó
    if (!req.user) {
        return res.status(401).json({ message: 'Không tìm thấy thông tin xác thực' });
    }

    const { vaiTro } = req.user; // Lấy VaiTro (admin/staff/customer) từ Token

    // Nếu vai trò là admin hoặc staff thì cho phép đi tiếp (gọi hàm next)
    if (vaiTro === 'Admin' || vaiTro === 'NhanVien') {
        next();
    } else {
        // Nếu là khách hàng bình thường (customer) thì chặn lại ngay
        return res.status(403).json({ message: 'Cảnh báo bảo mật: Bạn không có quyền truy cập khu vực này!' });
    }
};