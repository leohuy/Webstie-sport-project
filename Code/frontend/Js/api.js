
// goi api dang nhap va dang ky
async function handleAuth(event, type) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = '<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Đang xử lý...';

    try {
        if (type === 'login') {
            // GỌI API ĐĂNG NHẬP
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, matKhau: password })
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Đăng nhập thành công!", "success");
                // Lưu Token vào LocalStorage theo đúng yêu cầu đồ án
                localStorage.setItem('token', data.token);
                localStorage.setItem('userInfo', JSON.stringify(data.user));

                // Chuyển hướng sau 1.5 giây
                setTimeout(() => window.location.href = 'Home.html', 1500);
            } else {
                showToast(data.message || "Sai tài khoản hoặc mật khẩu!", "error");
            }

        } else if (type === 'register') {
            // GỌI API ĐĂNG KÝ
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const phone = document.getElementById('reg-phone').value;
            const password = document.getElementById('reg-password').value;
            const confirmPass = document.getElementById('reg-confirm-password').value;

            // Kiểm tra khớp mật khẩu ở Frontend trước khi gọi API
            if (password !== confirmPass) {
                showToast("Mật khẩu xác nhận không khớp!", "error");
                btn.disabled = false;
                btn.innerHTML = originalText;
                return;
            }

            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hoTen: name,
                    email: email,
                    soDienThoai: phone,
                    matKhau: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                showToast("Tạo tài khoản thành công! Vui lòng đăng nhập.", "success");
                // Tự động chuyển qua tab Đăng nhập và điền sẵn email
                switchTab('login');
                document.getElementById('login-email').value = email;
                document.getElementById('login-password').value = ''; // Xóa trắng pass cũ
            } else {
                showToast(data.message || "Lỗi đăng ký!", "error");
            }
        }
    } catch (error) {
        console.error("Lỗi kết nối:", error);
        showToast("Không thể kết nối đến máy chủ!", "error");
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
    }
}



// qpi lay danh sach san pham (productlist.html)

async function fetchAndRenderProducts() {
    // 1. Tìm khu vực lưới sản phẩm trên giao diện HTML
    const productGrid = document.getElementById('product-grid');

    // Nếu không tìm thấy (nghĩa là đang ở trang khác không phải ProductList), thì thoát hàm
    if (!productGrid) return;

    // Hiển thị trạng thái đang tải (Loading)
    productGrid.innerHTML = '<p class="text-center col-span-full text-gray-500">Đang tải sản phẩm...</p>';

    try {
        // 2. Gửi yêu cầu GET lên Backend Node.js
        const response = await fetch('http://localhost:3000/api/products');
        const result = await response.json();

        if (response.ok) {
            // Xóa chữ "Đang tải..."
            productGrid.innerHTML = '';

            // 3. Lặp qua từng sản phẩm và vẽ HTML
            result.data.forEach(product => {
                // Format giá tiền Việt Nam
                const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GiaMacDinh);

                const productCard = `
                    <div class="border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group cursor-pointer">
                        <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4 flex items-center justify-center">
                            <!-- Giả định ảnh được lưu trong thư mục assets/images/ hoặc lấy từ link thật -->
                            <img src="../assets/images/${product.HinhAnhChinh}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'" class="w-[85%] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
                        </div>
                        <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition">${product.TenSanPham}</h3>
                        <p class="text-xs text-gray-500 mb-2">${product.TenThuongHieu || 'Chưa cập nhật'} | ${product.TenDanhMuc || 'Chưa cập nhật'}</p>
                        <div class="flex items-end gap-2 mb-4 mt-auto">
                            <span class="text-blue-600 font-bold text-lg">${priceFormatted}</span>
                        </div>
                        <button class="w-full py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white transition shadow-sm">
                            Thêm vào giỏ
                        </button>
                    </div>
                `;

                // Nhét thẻ HTML vừa tạo vào lưới
                productGrid.innerHTML += productCard;
            });
        } else {
            productGrid.innerHTML = `<p class="text-center col-span-full text-red-500">Lỗi: ${result.message}</p>`;
        }
    } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
        productGrid.innerHTML = '<p class="text-center col-span-full text-red-500">Không thể kết nối đến máy chủ!</p>';
    }
}

// 4. Kích hoạt hàm ngay khi trang web tải xong nội dung
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderProducts();
});