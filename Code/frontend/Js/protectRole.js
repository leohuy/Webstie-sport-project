 // Kiểm tra quyền khi load trang Admin
    const userStr = localStorage.getItem('userInfo');
    const token = localStorage.getItem('token');
    if (!token || !userStr) {
        window.location.href = '../auth.html';
    } else {
        const user = JSON.parse(userStr);
        if (user.vaiTro === 'KhachHang') {
            alert("Bạn không có quyền truy cập trang quản trị!");
            window.location.href = '../index.html';
        }
    }
