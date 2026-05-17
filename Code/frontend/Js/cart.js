



// Định dạng tiền vnd
function formatMoney(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}

// chua thong tin gio hang
let cartData = [];

// load du lieu gio hang
async function loadCart() {
    // kiem tra, neu chua dang nhap thi chuyen den trang dang nhap
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'auth.html';
        return;
    }

    // Lấy thông tin Header
    const user = JSON.parse(localStorage.getItem('userInfo'));
    document.getElementById('header-name').innerText = user.hoTen;
    document.getElementById('header-avatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.hoTen)}&background=2563eb&color=fff`;

    try {
        const response = await fetch('http://localhost:3000/api/cart', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();

        if (response.ok) {
            cartData = result.data;
            renderCartItems();
        } else {
            showToast("Lỗi khi tải giỏ hàng", "error");
        }
    } catch (error) {
        console.error("Lỗi:", error);
    }
}
// load du lieu gio hang va hien thi
function renderCartItems() {
    const container = document.getElementById('cart-items-container');
    const emptyCart = document.getElementById('empty-cart');
    const btnCheckout = document.getElementById('btn-checkout');

    if (cartData.length === 0) {
        container.innerHTML = '';
        emptyCart.classList.remove('hidden');
        emptyCart.classList.add('flex');
        btnCheckout.classList.add('pointer-events-none', 'opacity-50'); // Khóa nút checkout
        updateSummary();
        return;
    }

    emptyCart.classList.add('hidden');
    emptyCart.classList.remove('flex');
    btnCheckout.classList.remove('pointer-events-none', 'opacity-50'); // Mở nút checkout
    container.innerHTML = '';

    cartData.forEach((item, index) => {
        // Giá lấy từ bảng BIENTHE_SANPHAM 
        const price = item.GiaBan || 0;

        container.innerHTML += `
                    <div class="bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 relative group transition hover:shadow-md" id="item-${item.MaChiTietGH}">
                        
                        <button onclick="removeItem(${item.MaChiTietGH}, ${index})" class="absolute top-4 right-4 sm:static sm:order-last w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition">
                            <i data-lucide="trash-2" class="w-5 h-5"></i>
                        </button>

                        <div class="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-gray-100 p-2">
                            <img src="../assets/images/${item.HinhAnhChinh}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200'" class="w-full h-full object-contain mix-blend-multiply">
                        </div>

                        <div class="flex-grow flex flex-col w-full">
                            <div class="flex flex-col sm:flex-row sm:justify-between mb-2 pr-8 sm:pr-0">
                                <div>
                                    <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase mb-1 inline-block">${item.TenThuongHieu || 'Phụ Kiện'}</span>
                                    <h3 class="font-bold text-gray-800 text-base md:text-lg line-clamp-2 hover:text-blue-600 cursor-pointer transition">${item.TenSanPham}</h3>
                                    <p class="text-sm text-gray-500 mt-1">Phân loại: <span class="font-semibold text-gray-800">${item.KichCo}</span></p>
                                </div>
                            </div>

                            <div class="flex items-end justify-between mt-4">
                                <div>
                                    <p class="text-blue-700 font-bold text-lg">${formatMoney(price)}</p>
                                </div>
                                
                                <div class="flex items-center border border-gray-300 rounded-lg h-9 w-28 bg-white">
                                    <button onclick="updateQty(${item.MaChiTietGH}, -1, ${index})" class="w-8 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-l-lg transition">
                                        <i data-lucide="minus" class="w-4 h-4"></i>
                                    </button>
                                    <input type="number" readonly value="${item.SoLuong}" class="w-full h-full text-center font-bold text-gray-900 border-x border-gray-200 outline-none bg-transparent text-sm">
                                    <button onclick="updateQty(${item.MaChiTietGH}, 1, ${index})" class="w-8 h-full flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-r-lg transition">
                                        <i data-lucide="plus" class="w-4 h-4"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
    });

    lucide.createIcons();
    updateSummary();
}
// TÍNH TÓAN TỔNG TIỀN
function updateSummary() {
    let subtotal = 0;
    let totalItems = 0;

    cartData.forEach(item => {
        subtotal += (item.GiaBan * item.SoLuong);
        totalItems += item.SoLuong;
    });

    document.getElementById('subtotal').innerText = formatMoney(subtotal);
    document.getElementById('total-price').innerText = formatMoney(subtotal);
    document.getElementById('total-items').innerText = totalItems;
    document.getElementById('cart-count').innerText = cartData.length;
}
// API GỌI XUỐNG BACKEND ĐỂ CẬP NHẬT SỐ LƯỢNG
async function updateQty(maChiTietGH, change, index) {
    let newQty = cartData[index].SoLuong + change;
    if (newQty < 1) return; // Không cho giảm dưới 1

    // Cập nhật giao diện trước cho nhanh (Optimistic UI)
    cartData[index].SoLuong = newQty;
    renderCartItems();

    // Gửi API ngầm xuống Server
    const token = localStorage.getItem('token');
    await fetch('http://localhost:3000/api/cart/update', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ maChiTietGH: maChiTietGH, soLuong: newQty })
    });
}
// API GỌI XUỐNG BACKEND ĐỂ XÓA SẢN PHẨM
async function removeItem(maChiTietGH, index) {
    const token = localStorage.getItem('token');
    const itemElement = document.getElementById(`item-${maChiTietGH}`);

    // Xóa phần tử khỏi mảng JS và re-render
    cartData.splice(index, 1);
    renderCartItems();

    // Gửi API xóa xuống Database
    await fetch(`http://localhost:3000/api/cart/remove/${maChiTietGH}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    showToast("Đã xóa sản phẩm khỏi giỏ hàng", "success");
}
// HÀM XỬ LÝ KHI KHÁCH HÀNG BẤM NÚT ĐẶT HÀNG
async function handlePlaceOrder(event) {
    event.preventDefault(); 

    // 1. Lấy Token đăng nhập của khách hàng
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Vui lòng đăng nhập trước khi thực hiện thanh toán!");
        window.location.href = "login.html";
        return;
    }

    const selectedAddressRadio = document.querySelector('input[name="address"]:checked');
    const maDiaChi = selectedAddressRadio ? selectedAddressRadio.value : null;

    // Ví dụ: Lấy phương thức thanh toán (COD hoặc VNPAY)
    const selectedPaymentRadio = document.querySelector('input[name="payment"]:checked');
    const phuongThucThanhToan = selectedPaymentRadio ? selectedPaymentRadio.value : 'COD';

    // Ví dụ: Lấy ghi chú đơn hàng
    const ghiChuElement = document.getElementById('order-note');
    const ghiChu = ghiChuElement ? ghiChuElement.value.trim() : '';

    // 3. Kiểm tra xem khách hàng có chọn địa chỉ chưa
    if (!maDiaChi) {
        alert("Vui lòng chọn hoặc thêm địa chỉ giao hàng!");
        return;
    }

    // 4. Kiểm tra chế độ mua: "Mua Ngay" hay "Đặt từ Giỏ Hàng"
    // Thường khi ấn "Mua ngay", bạn sẽ lưu tạm thông tin sản phẩm vào sessionStorage/localStorage
    const buyNowData = JSON.parse(sessionStorage.getItem('buyNowItem'));
    let buyNowItem = null;

    if (buyNowData) {
        buyNowItem = {
            maBienThe: buyNowData.maBienThe,
            soLuong: buyNowData.soLuong
        };
    }

    // Giao diện hiển thị trạng thái đang xử lý để tránh khách bấm nút nhiều lần
    const orderBtn = document.getElementById('btn-place-order'); // ID nút đặt hàng của bạn
    if (orderBtn) {
        orderBtn.innerText = "ĐANG XỬ LÝ...";
        orderBtn.disabled = true;
    }

    // 5. Đóng gói dữ liệu và gửi yêu cầu POST lên Backend
    try {
        const response = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                maDiaChi: maDiaChi,
                phuongThucThanhToan: phuongThucThanhToan,
                ghiChu: ghiChu,
                buyNowItem: buyNowItem // Sẽ là null nếu mua từ giỏ hàng như bình thường
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(" Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại SportFlex.");

            // Nếu là chế độ mua ngay, xóa dữ liệu mua ngay sau khi xong
            if (buyNowData) sessionStorage.removeItem('buyNowItem');

            // Chuyển hướng khách hàng sang trang hoàn tất hoặc trang lịch sử mua hàng
            window.location.href = `orderSuccess.html?id=${result.maTraCuu}`;
        } else {
            alert(result.message || "Đã xảy ra lỗi trong quá trình đặt hàng.");
            if (orderBtn) {
                orderBtn.innerText = "HOÀN TẤT ĐẶT HÀNG";
                orderBtn.disabled = false;
            }
        }
    } catch (error) {
        console.error("Lỗi đặt hàng:", error);
        alert("Lỗi kết nối mạng hoặc hệ thống máy chủ gặp sự cố!");
        if (orderBtn) {
            orderBtn.innerText = "HOÀN TẤT ĐẶT HÀNG";
            orderBtn.disabled = false;
        }
    }
}

// KHỞI ĐỘNG
document.addEventListener('DOMContentLoaded', loadCart);
