


// Hàm tự động Active Menu dựa vào URL
function highlightActiveMenu() {
    // 1. Lấy tham số danhMuc từ URL (ví dụ URL đang là ?danhMuc=2 thì urlCategoryId = "2")
    const urlParams = new URLSearchParams(window.location.search);
    const urlCategoryId = urlParams.get('danhMuc');
    
    // Lấy đường dẫn hiện tại (để xử lý riêng cho trang Home)
    const currentPath = window.location.pathname;

    // 2. Tìm tất cả các thẻ a có class 'nav-item'
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        // Lấy data-id của thẻ a đó
        const itemCategoryId = item.getAttribute('data-id');

        // Logic 1: Đang ở trang ProductList và có danhMuc
        if (urlCategoryId && itemCategoryId === urlCategoryId) {
            item.classList.remove('text-gray-600'); // Xóa màu xám cũ
            // Thêm màu xanh đậm và gạch chân (Tailwind CSS)
            item.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'font-bold');
        } 
        // Logic 2: Đang ở trang chủ (Home.html)
        else if (!urlCategoryId && currentPath.includes('Home.html') && item.getAttribute('href') === 'Home.html') {
            item.classList.remove('text-gray-600');
            item.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'font-bold');
        }
    });
}

// Chạy hàm ngay khi tải xong giao diện
document.addEventListener('DOMContentLoaded', highlightActiveMenu);