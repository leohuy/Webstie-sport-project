  function showToast(message, type = 'success') {
            const toast = document.getElementById('toast');
            const toastMsg = document.getElementById('toast-message');
            toast.className = `fixed top-4 right-4 text-white px-6 py-3 rounded-lg shadow-2xl transform transition-transform duration-300 z-50 flex items-center gap-3 ${type==='success'?'bg-green-600':'bg-red-600'}`;
            toastMsg.innerText = message;
            toast.classList.remove('translate-x-full');
            setTimeout(() => toast.classList.add('translate-x-full'), 3000);
        }
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

// load danh muc san pham len trang chu
async function loadHomepageData() {
    const categoryList = document.getElementById('category-list');
    const bestsellerList = document.getElementById('bestseller-list');

    // Nếu không có 2 ID này (Nghĩa là không phải trang chủ) thì thoát hàm
    if (!categoryList || !bestsellerList) return;

    try {
        //  Fetch Danh Mục
        const catRes = await fetch('http://localhost:3000/api/categories');
        const catResult = await catRes.json();

        if (catRes.ok) {
            categoryList.innerHTML = ''; // Xóa rỗng
            catResult.data.forEach(cat => {
                // Tùy biến icon theo tên danh mục
                let icon = 'ph-sneaker';
                if (cat.TenDanhMuc.includes('Tạ')) icon = 'ph-barbell';
                if (cat.TenDanhMuc.includes('Áo')) icon = 'ph-t-shirt';
                if (cat.TenDanhMuc.includes('Vợt')) icon = 'ph-tennis-ball';
                if (cat.TenDanhMuc.includes('Balo')) icon = 'ph-backpack';

                categoryList.innerHTML += `
                    <div class="flex flex-col items-center gap-3 cursor-pointer group">
                        <div class="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden p-1 border-2 border-transparent group-hover:border-blue-500 transition-colors flex items-center justify-center bg-gray-100">
                            <i class="ph ${icon} text-5xl text-gray-400 group-hover:text-blue-500 transition"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-700 group-hover:text-blue-600 transition">${cat.TenDanhMuc}</span>
                    </div>
                `;
            });
        }

        // Fetch Sản Phẩm Bán Chạy
        const prodRes = await fetch('http://localhost:3000/api/products/best-sellers');
        const prodResult = await prodRes.json();

        if (prodRes.ok) {
            bestsellerList.innerHTML = ''; // Xóa rỗng
            prodResult.data.forEach(product => {
                const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GiaMacDinh);

                bestsellerList.innerHTML += `
                    <div class="border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group">
                        
                        <a href="ProductDetail.html?id=${product.MaSanPham}" class="block cursor-pointer">
                            <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4 flex items-center justify-center">
                                <span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">HOT</span>
                                <img src="./assets/images/${product.HinhAnhChinh}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'" class="w-[80%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500">
                            </div>
                            <div class="flex items-center gap-1 text-yellow-400 text-xs mb-2">
                                <i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i>
                            </div>
                            <h3 class="font-bold text-gray-800 text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition">${product.TenSanPham}</h3>
                        </a>

                        <div class="flex items-end gap-2 mb-4 mt-auto">
                            <span class="text-blue-600 font-bold text-lg">${priceFormatted}</span>
                        </div>
                        <button onclick="addToCart(${product.MaBienThe})" class="w-full py-2.5 rounded-lg border border-gray-200 text-blue-600 font-semibold text-sm flex justify-center items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition">
                            <i class="ph ph-shopping-cart text-lg"></i> Thêm vào giỏ
                        </button>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Lỗi khi fetch dữ liệu trang chủ:", error);
    }
}

// // qpi lay danh sach san pham (productlist.html)
    // async function fetchAndRenderProducts() {
    //     //Tìm khu vực lưới sản phẩm trên giao diện HTML
    //     const productGrid = document.getElementById('product-grid');

    //     // Nếu không tìm thấy (nghĩa là đang ở trang khác không phải ProductList), thì thoát hàm
    //     if (!productGrid) return;

    //     // Hiển thị trạng thái đang tải (Loading)
    //     productGrid.innerHTML = '<p class="text-center col-span-full text-gray-500">Đang tải sản phẩm...</p>';

    //     try {
    //         // Gửi yêu cầu GET lên Backend Node.js
    //         const response = await fetch('http://localhost:3000/api/products');
    //         const result = await response.json();

    //         if (response.ok) {
    //             // Xóa chữ "Đang tải..."
    //             productGrid.innerHTML = '';

    //             // Lặp qua từng sản phẩm và vẽ HTML
    //             result.data.forEach(product => {
    //                 // Format giá tiền Việt Nam
    //                 const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GiaMacDinh);
    //                 const productCard = `
    //                     <div class="border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group cursor-pointer">
    //                         <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4 flex items-center justify-center">
    //                             <!-- Giả định ảnh được lưu trong thư mục assets/images/ hoặc lấy từ link thật -->
    //                             <img src="../assets/images/${product.HinhAnhChinh}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'" class="w-[85%] object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
    //                         </div>
    //                         <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition">${product.TenSanPham}</h3>
    //                         <p class="text-xs text-gray-500 mb-2">${product.TenThuongHieu || 'Chưa cập nhật'} | ${product.TenDanhMuc || 'Chưa cập nhật'}</p>
    //                         <div class="flex items-end gap-2 mb-4 mt-auto">
    //                             <span class="text-blue-600 font-bold text-lg">${priceFormatted}</span>
    //                         </div>
    //                         <button onclick="addToCart(${product.MaBienThe})" class="w-full py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white transition shadow-sm">
    //                             Thêm vào giỏ
    //                         </button>
    //                     </div>
    //                 `;

    //                 // Nhét thẻ HTML vừa tạo vào lưới
    //                 productGrid.innerHTML += productCard;
    //             });
    //         } else {
    //             productGrid.innerHTML = `<p class="text-center col-span-full text-red-500">Lỗi: ${result.message}</p>`;
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi fetch sản phẩm:", error);
    //         productGrid.innerHTML = '<p class="text-center col-span-full text-red-500">Không thể kết nối đến máy chủ!</p>';
    //     }
    // }
async function fetchAndRenderProducts() {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;

    productGrid.innerHTML = '<p class="text-center col-span-full text-gray-500">Đang tải sản phẩm...</p>';

    try {
        // Đọc tham số từ URL trình duyệt
        const urlParams = new URLSearchParams(window.location.search);
        const danhMucId = urlParams.get('danhMuc'); // Sẽ lấy ra được số '1', '2' hoặc null

        // Nối tham số vào link API gửi cho Backend
        let apiUrl = 'http://localhost:3000/api/products';
        if (danhMucId) {
            apiUrl += `?danhMuc=${danhMucId}`;
        }

        //  Đổi lại tiêu đề trang (UI) cho chuyên nghiệp (Tùy chọn)
        const pageTitle = document.getElementById('page-title'); // Nhớ gắn id="page-title" vào thẻ <h1> ở ProductList.html nhé
        if (pageTitle) {
            if (danhMucId === '1') pageTitle.innerText = 'GIÀY THỂ THAO';
            else if (danhMucId === '2') pageTitle.innerText = 'QUẦN ÁO THỂ THAO';
            else if (danhMucId === '4') pageTitle.innerText = 'PHỤ KIỆN';
            else pageTitle.innerText = 'TẤT CẢ SẢN PHẨM';
        }

        // Gọi API
        const response = await fetch(apiUrl);
        const result = await response.json();

        if (response.ok) {
            productGrid.innerHTML = '';
            
            if(result.data.length === 0) {
                productGrid.innerHTML = '<p class="text-center col-span-full text-gray-500">Đang cập nhật sản phẩm cho danh mục này.</p>';
                return;
            }

            result.data.forEach(product => {
                const priceFormatted = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.GiaMacDinh);
              const productCard = `
                    <div class="border border-gray-100 rounded-2xl p-4 bg-white hover:shadow-xl hover:border-blue-100 transition-all duration-300 flex flex-col group">
                        
                        <a href="ProductDetail.html?id=${product.MaSanPham}" class="block cursor-pointer">
                            <div class="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-50 mb-4 flex items-center justify-center">
                                <img src="../assets/images/${product.HinhAnhChinh}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400'" class="w-[85%] object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 drop-shadow-xl">
                            </div>
                            <h3 class="font-bold text-gray-800 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition">${product.TenSanPham}</h3>
                        </a>

                        <p class="text-xs text-gray-500 mb-2">${product.TenThuongHieu || 'Phụ kiện'} | ${product.TenDanhMuc || ''}</p>
                        <div class="flex items-end gap-2 mb-4 mt-auto">
                            <span class="text-blue-600 font-bold text-lg">${priceFormatted}</span>
                        </div>
                        
                        <button onclick="addToCart(${product.MaBienThe})" class="w-full py-2.5 rounded-lg bg-blue-50 text-blue-600 font-semibold text-sm hover:bg-blue-600 hover:text-white transition shadow-sm">
                            Thêm vào giỏ
                        </button>
                    </div>
                `;
                productGrid.innerHTML += productCard;
            });
        }
    } catch (error) {
        console.error("Lỗi khi fetch sản phẩm:", error);
    }
}
// them san pham vao gio hang 
async function addToCart(maBienThe) {
    const token = localStorage.getItem('token');

    // Kiểm tra đăng nhập
    if (!token) {
        showToast("Vui lòng đăng nhập để mua hàng!", "error");
        setTimeout(() => window.location.href = 'auth.html', 1500);
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // <--- ĐÍNH KÈM TOKEN Ở ĐÂY
            },
            body: JSON.stringify({
                maBienThe: maBienThe,
                soLuong: 1
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(data.message, "success");
        
        } else {
            showToast(data.message, "error");
        }
    } catch (error) {
        console.error("Lỗi khi thêm giỏ hàng:", error);
        showToast("Không thể kết nối đến máy chủ!", "error");
    }
}


// Kích hoạt hàm ngay khi trang web tải xong nội dung
document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderProducts();
    loadHomepageData();
});

