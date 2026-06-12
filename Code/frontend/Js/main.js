
// Hàm định dạng số thành định dạng tiền tệ Việt Nam 
function formatMoneyHeader(amount) {
    return parseInt(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
}

function isPagesSection() {
    return /[\\/]pages[\\/]/.test(window.location.pathname);
}

function getPageLink(pagePath) {
    return isPagesSection() ? pagePath : `pages/${pagePath}`;
}

function getImagePath(fileName) {
    return isPagesSection() ? `../assets/images/${fileName}` : `assets/images/${fileName}`;
}
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
        // Logic 2: Đang ở trang chủ (index.html)
        else if (!urlCategoryId && currentPath.includes('index.html') && (item.getAttribute('href') || '').endsWith('index.html')) {
            item.classList.remove('text-gray-600');
            item.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'font-bold');
        }
    });
}
// HÀM XỬ LÝ TÌM KIẾM TỪ HEADER
function setupSearchBar() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchSuggestions = document.getElementById('search-suggestions');

    if (!searchInput || !searchBtn || !searchSuggestions) return;

    let searchTimeout = null;

    // 1. HÀM TÌM KIẾM GỢI Ý KHI ĐANG GÕ (Live Search)
    searchInput.addEventListener('input', (e) => {
        const keyword = e.target.value.trim();

        // Nếu xóa hết chữ thì ẩn gợi ý
        if (keyword.length === 0) {
            searchSuggestions.classList.add('hidden');
            return;
        }

        // Áp dụng kỹ thuật Debounce (Đợi gõ xong 0.5s mới gọi API)
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async () => {
            try {
                // Tận dụng luôn API getAllProducts đã có chức năng search
                const response = await fetch(`http://localhost:8080/api/products?search=${encodeURIComponent(keyword)}`);
                const result = await response.json();

                if (response.ok && result.data.length > 0) {
                    // Lấy tối đa 5 sản phẩm đầu tiên để gợi ý
                    const suggestions = result.data.slice(0, 5);
                    searchSuggestions.innerHTML = '';

                    suggestions.forEach(product => {
                        const img = product.HinhAnhChinh.startsWith('http') ? product.HinhAnhChinh : getImagePath(product.HinhAnhChinh);
                        searchSuggestions.innerHTML += `
                            <a href="${getPageLink(`ProductDetail.html?id=${product.MaSanPham}`)}" class="flex items-center gap-3 p-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0">
                                <img src="${img}" onerror="this.src='https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'" class="w-12 h-12 object-contain bg-gray-100 rounded p-1">
                                <div class="flex-1">
                                    <h4 class="text-sm font-bold text-gray-800 line-clamp-1 hover:text-blue-600">${product.TenSanPham}</h4>
                                    <span class="text-sm font-black text-blue-600 mt-0.5 inline-block">${formatMoneyHeader(product.GiaMacDinh)}</span>
                                </div>
                            </a>
                        `;
                    });

                    // Có thể thêm nút "Xem tất cả" ở cuối
                    searchSuggestions.innerHTML += `
                        <button onclick="executeSearch()" class="w-full text-center p-3 text-sm text-gray-500 font-semibold hover:text-blue-600 hover:bg-blue-50 transition">
                            Xem tất cả kết quả cho "${keyword}" <i class="ph ph-arrow-right align-middle ml-1"></i>
                        </button>
                    `;

                    searchSuggestions.classList.remove('hidden');
                } else {
                    searchSuggestions.innerHTML = `<div class="p-4 text-center text-sm text-gray-500">Không tìm thấy sản phẩm nào phù hợp với "${keyword}"</div>`;
                    searchSuggestions.classList.remove('hidden');
                }
            } catch (error) {
                console.error("Lỗi tải gợi ý tìm kiếm:", error);
            }
        }, 300); // 500ms
    });

    // 2. HÀM CHUYỂN TRANG KHI BẤM TÌM KIẾM
    window.executeSearch = () => {
        const keyword = searchInput.value.trim();
        if (keyword !== '') {
            window.location.href = getPageLink(`ProductList.html?search=${encodeURIComponent(keyword)}`);
        }
    };

    // Bắt sự kiện Click nút Tìm và ấn Enter
    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            executeSearch();
        }
    });

    // 3. ẨN KHUNG GỢI Ý KHI CLICK RA CHỖ KHÁC TRÊN MÀN HÌNH
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.classList.add('hidden');
        }
    });
}

// Chạy hàm ngay khi tải xong giao diện
document.addEventListener('DOMContentLoaded', function () {
    highlightActiveMenu();
    setupSearchBar();
});


document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('product-slider');
    const btnPrev = document.getElementById('slider-prev');
    const btnNext = document.getElementById('slider-next');

    // Khoảng cách mỗi lần cuộn (Ví dụ: cuộn 1 thẻ sản phẩm 280px + gap 24px)
    const scrollAmount = 304; 
    let autoSlideInterval;

    // 1. Hàm cuộn sang phải
    const scrollRight = () => {
        if (slider) {
            // Nếu đã cuộn đến kịch kim bên phải -> Quay lại từ đầu
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    // 2. Hàm cuộn sang trái
    const scrollLeft = () => {
        if (slider) {
            slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    // 3. Gắn sự kiện cho nút bấm
    if (btnNext) btnNext.addEventListener('click', () => {
        scrollRight();
        resetAutoSlide(); // Khi người dùng tự bấm thì reset bộ đếm thời gian
    });
    
    if (btnPrev) btnPrev.addEventListener('click', () => {
        scrollLeft();
        resetAutoSlide();
    });

    // 4. Thiết lập Tự động trượt (Auto Slide) mỗi 5 giây
    function startAutoSlide() {
        autoSlideInterval = setInterval(scrollRight, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        startAutoSlide(); // Bắt đầu đếm lại 5 giây
    }

    // Tạm dừng tự động trượt khi rê chuột vào khu vực sản phẩm
    if (slider) {
        slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Khởi động khi load trang
        startAutoSlide();
    }
});