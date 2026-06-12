-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 10, 2026 lúc 08:16 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `sportecom_db`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bienthe_sanpham`
--

CREATE TABLE `bienthe_sanpham` (
  `MaBienThe` int(11) NOT NULL,
  `MaSanPham` int(11) NOT NULL,
  `KichCo` varchar(50) NOT NULL,
  `SoLuongTon` int(11) NOT NULL DEFAULT 0,
  `GiaBan` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `bienthe_sanpham`
--

INSERT INTO `bienthe_sanpham` (`MaBienThe`, `MaSanPham`, `KichCo`, `SoLuongTon`, `GiaBan`) VALUES
(1, 1, '40', 23, 2500000.00),
(2, 1, '41', 5, 2500000.00),
(3, 2, 'Freesize', 25, 850000.00),
(4, 3, '39', 20, 2450000.00),
(5, 3, '40', 20, 2450000.00),
(6, 3, '41', 8, 2450000.00),
(7, 3, '42', 12, 2450000.00),
(8, 4, '40', 8, 1850000.00),
(9, 4, '41', 10, 1850000.00),
(10, 4, '43', 7, 1850000.00),
(11, 5, 'Free Size', 50, 650000.00),
(12, 6, 'Dày 8mm', 30, 450000.00),
(13, 7, '40', 10, 3200000.00),
(14, 7, '41', 15, 3200000.00),
(15, 7, '42', 20, 3200000.00),
(16, 8, '41', 9, 2890000.00),
(17, 8, '42', 10, 2890000.00),
(18, 9, '39', 25, 2750000.00),
(19, 9, '40', 30, 2750000.00),
(20, 9, '41', 12, 2750000.00),
(21, 10, '40', 40, 850000.00),
(22, 10, '41', 35, 850000.00),
(23, 10, '42', 20, 850000.00),
(24, 11, '39', 5, 2450000.00),
(25, 11, '40', 12, 2450000.00),
(26, 11, '41', 20, 2450000.00),
(27, 11, '42', 5, 2450000.00),
(28, 11, '43', 8, 2450000.00),
(29, 11, '44', 3, 2550000.00),
(30, 12, '41', 123, 12323122.00),
(31, 13, '40', 100, 340000.00),
(32, 13, '41', 200, 340000.00),
(33, 16, '41', 123, 140374.00),
(34, 16, '42', 123, 140374.00),
(35, 17, '46', 12, 140374.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiet_donhang`
--

CREATE TABLE `chitiet_donhang` (
  `MaChiTiet` int(11) NOT NULL,
  `MaDonHang` int(11) NOT NULL,
  `MaBienThe` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL,
  `GiaLucMua` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chitiet_donhang`
--

INSERT INTO `chitiet_donhang` (`MaChiTiet`, `MaDonHang`, `MaBienThe`, `SoLuong`, `GiaLucMua`) VALUES
(1, 5, 3, 2, 850000.00),
(2, 5, 4, 1, 2450000.00),
(3, 5, 21, 1, 850000.00),
(4, 5, 18, 1, 2750000.00),
(5, 6, 3, 1, 850000.00),
(6, 7, 4, 1, 2450000.00),
(7, 8, 1, 1, 2500000.00),
(8, 9, 24, 2, 2450000.00),
(9, 10, 3, 1, 850000.00),
(10, 11, 1, 3, 2500000.00),
(11, 11, 3, 3, 850000.00),
(12, 11, 8, 3, 1850000.00),
(13, 11, 4, 4, 2450000.00),
(14, 11, 16, 1, 2890000.00),
(15, 12, 3, 1, 850000.00),
(16, 13, 4, 1, 2450000.00),
(17, 14, 3, 1, 850000.00),
(18, 14, 1, 1, 2500000.00),
(19, 14, 4, 1, 2450000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chitiet_giohang`
--

CREATE TABLE `chitiet_giohang` (
  `MaChiTietGH` int(11) NOT NULL,
  `MaGioHang` int(11) NOT NULL,
  `MaBienThe` int(11) NOT NULL,
  `SoLuong` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhgia`
--

CREATE TABLE `danhgia` (
  `MaDanhGia` int(11) NOT NULL,
  `MaSanPham` int(11) NOT NULL,
  `MaNguoiDung` int(11) NOT NULL,
  `DiemSo` int(11) DEFAULT NULL CHECK (`DiemSo` between 1 and 5),
  `BinhLuan` text DEFAULT NULL,
  `NgayDanhGia` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danhgia`
--

INSERT INTO `danhgia` (`MaDanhGia`, `MaSanPham`, `MaNguoiDung`, `DiemSo`, `BinhLuan`, `NgayDanhGia`) VALUES
(1, 3, 2, 5, 'Giày đi rất êm, màu sắc cực cháy!', '2026-05-03 22:44:26'),
(2, 3, 2, 4, 'Form giày hơi ôm, nên tăng nửa size.', '2026-05-03 22:44:26'),
(3, 4, 2, 5, 'Puma lúc nào cũng làm giày đẹp, đáng tiền.', '2026-05-03 22:44:26'),
(4, 5, 2, 5, 'Balo rộng rãi, đựng vừa laptop 15inch và đồ tập.', '2026-05-03 22:44:26'),
(5, 6, 2, 4, 'Thảm xài êm, không bị trượt tay khi tập ra mồ hôi.', '2026-05-03 22:44:26'),
(6, 11, 1, 5, 'Giày đi cực êm, màu đỏ ở ngoài nhìn cháy hơn trong ảnh rất nhiều. Giao hàng siêu tốc!', '2026-05-11 08:24:56'),
(7, 11, 2, 4, 'Form giày hơi ôm ngang, bạn nào chân bè (to ngang) thì nên up lên 1 size nhé. Đệm Air max thì quá đỉnh rồi.', '2026-05-11 08:24:56'),
(8, 11, 1, 5, 'Mua tặng chồng mà chồng thích mê. Đi tập tạ rất bám sàn, không bị trơn trượt.', '2026-05-11 08:24:56'),
(9, 2, 4, 4, 'ngon lam', '2026-05-23 12:49:53');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danhmuc`
--

CREATE TABLE `danhmuc` (
  `MaDanhMuc` int(11) NOT NULL,
  `TenDanhMuc` varchar(255) NOT NULL,
  `MoTa` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danhmuc`
--

INSERT INTO `danhmuc` (`MaDanhMuc`, `TenDanhMuc`, `MoTa`) VALUES
(1, 'Giày Thể Thao', 'Các loại giày chạy bộ, bóng đá'),
(2, 'Phụ Kiện', 'Balo, túi xách, băng đô'),
(3, 'Tạ & Thể hình', 'Trang thiết bị tập gym tại nhà'),
(4, 'Đồ Thể Thao', 'Quần áo tập luyện chuyên nghiệp'),
(5, 'Vợt & Bóng', 'Phụ kiện bóng đá, cầu lông, tennis'),
(6, 'Balo & Túi Xách', 'Túi đựng đồ thể thao chống nước');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `diachi`
--

CREATE TABLE `diachi` (
  `MaDiaChi` int(11) NOT NULL,
  `MaNguoiDung` int(11) NOT NULL,
  `TenNguoiNhan` varchar(255) NOT NULL,
  `SoDienThoaiNhan` varchar(20) NOT NULL,
  `DiaChiChiTiet` text NOT NULL,
  `LaMacDinh` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `diachi`
--

INSERT INTO `diachi` (`MaDiaChi`, `MaNguoiDung`, `TenNguoiNhan`, `SoDienThoaiNhan`, `DiaChiChiTiet`, `LaMacDinh`) VALUES
(2, 4, 'letw', '9761346346324', 'sdfsdf, Xã Má Lé, Huyện Đồng Văn, Tỉnh Hà Giang', 1),
(6, 4, 'Võ Thành Đạt', '0994266363', 'số 10, đường Võ Nguyên Giáp, Xã Tân Lược, Huyện Bình Tân, Tỉnh Vĩnh Long', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `donhang`
--

CREATE TABLE `donhang` (
  `MaDonHang` int(11) NOT NULL,
  `MaNguoiDung` int(11) DEFAULT NULL,
  `MaDiaChi` int(11) DEFAULT NULL,
  `MaTraCuu` varchar(50) NOT NULL,
  `NgayDat` datetime DEFAULT current_timestamp(),
  `TongTien` decimal(10,2) NOT NULL,
  `TrangThaiDonHang` enum('ChoXacNhan','DangXuLy','DangGiao','DaGiao','DaHuy') DEFAULT 'ChoXacNhan',
  `PhuongThucThanhToan` enum('COD','VNPAY') NOT NULL,
  `TrangThaiThanhToan` enum('ChuaThanhToan','DaThanhToan','LoiThanhToan') DEFAULT 'ChuaThanhToan',
  `GhiChu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `donhang`
--

INSERT INTO `donhang` (`MaDonHang`, `MaNguoiDung`, `MaDiaChi`, `MaTraCuu`, `NgayDat`, `TongTien`, `TrangThaiDonHang`, `PhuongThucThanhToan`, `TrangThaiThanhToan`, `GhiChu`) VALUES
(1, 1, NULL, 'SFX100001', '2026-05-17 18:47:26', 1250000.00, 'DaGiao', 'COD', 'ChuaThanhToan', 'Giao hàng trong giờ hành chính giúp mình nha.'),
(2, 2, NULL, 'SFX100002', '2026-05-16 18:47:26', 3450000.00, 'DaGiao', 'VNPAY', 'DaThanhToan', ''),
(3, 1, 2, 'SFX100003', '2026-05-14 18:47:26', 450000.00, 'DaGiao', 'COD', 'DaThanhToan', 'Gọi trước khi giao 15 phút.'),
(4, 3, NULL, 'SFX100004', '2026-05-12 18:47:26', 890000.00, 'DaHuy', 'VNPAY', 'ChuaThanhToan', 'Khách hàng đổi ý muốn mua mẫu khác.'),
(5, 4, 2, 'SFX467284', '2026-05-17 20:27:47', 7750000.00, 'DaGiao', 'COD', 'ChuaThanhToan', ''),
(6, 4, 2, 'SFX195861', '2026-05-18 07:13:15', 850000.00, 'DaGiao', 'COD', 'ChuaThanhToan', ''),
(7, 4, 2, 'SFX035943', '2026-05-18 09:40:35', 2450000.00, 'DaHuy', 'COD', 'ChuaThanhToan', ''),
(8, 4, 2, 'SFX843310', '2026-05-18 09:54:03', 2500000.00, 'DangGiao', 'COD', 'ChuaThanhToan', ''),
(9, 4, 2, 'SFX086719', '2026-05-22 23:24:46', 4900000.00, 'DangGiao', 'COD', 'ChuaThanhToan', ''),
(10, 4, 2, 'SFX871378', '2026-05-23 13:14:31', 850000.00, 'DaHuy', '', 'ChuaThanhToan', ''),
(11, 4, 2, 'SFX981589', '2026-05-23 13:16:21', 28290000.00, 'DaHuy', '', 'ChuaThanhToan', ''),
(12, 4, 2, 'SFX078591', '2026-05-23 13:17:58', 850000.00, 'DaHuy', 'COD', 'ChuaThanhToan', ''),
(13, 4, 2, 'SFX097074', '2026-05-23 13:18:17', 2450000.00, 'ChoXacNhan', '', 'ChuaThanhToan', ''),
(14, 4, 6, 'SFX891230', '2026-06-09 13:01:31', 5800000.00, 'ChoXacNhan', '', 'ChuaThanhToan', '');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `giohang`
--

CREATE TABLE `giohang` (
  `MaGioHang` int(11) NOT NULL,
  `MaNguoiDung` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `giohang`
--

INSERT INTO `giohang` (`MaGioHang`, `MaNguoiDung`) VALUES
(1, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `hinhanh_sanpham`
--

CREATE TABLE `hinhanh_sanpham` (
  `MaAnh` int(11) NOT NULL,
  `MaSanPham` int(11) NOT NULL,
  `DuongDanAnh` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `hinhanh_sanpham`
--

INSERT INTO `hinhanh_sanpham` (`MaAnh`, `MaSanPham`, `DuongDanAnh`) VALUES
(9, 16, 'https://cdn.hstatic.net/products/1000061481/avatar__8_of_24__5af355d9399b453dbfad9d82b1a4bcbf_1024x1024.jpg'),
(10, 16, 'https://cdn.hstatic.net/products/1000061481/avatar__7_of_24__7fa4f6e9fa4f4a88a18b918a1a671429_1024x1024.jpg'),
(11, 16, 'https://cdn.hstatic.net/products/1000061481/avatar__6_of_24__ea1216750dbd4af0a54ac65d842e5cb8_1024x1024.jpg'),
(12, 16, 'https://cdn.hstatic.net/products/1000061481/avatar__5_of_24__56061b8774304af29815b19ce46b40b5_1024x1024.jpg');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoidung`
--

CREATE TABLE `nguoidung` (
  `MaNguoiDung` int(11) NOT NULL,
  `HoTen` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `MatKhau` varchar(255) NOT NULL,
  `SoDienThoai` varchar(20) DEFAULT NULL,
  `VaiTro` enum('KhachHang','NhanVien','Admin') DEFAULT 'KhachHang',
  `TrangThai` enum('HoatDong','BiKhoa') DEFAULT 'HoatDong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoidung`
--

INSERT INTO `nguoidung` (`MaNguoiDung`, `HoTen`, `Email`, `MatKhau`, `SoDienThoai`, `VaiTro`, `TrangThai`) VALUES
(1, 'Lê Tuấn Huy', 'admin@sportecom.vn', '123456', '0901234567', 'Admin', 'HoatDong'),
(2, 'Khách Hàng A', 'khachhang@gmail.com', '123456', '0987654321', 'KhachHang', 'HoatDong'),
(3, 'Trần Đạt', 'dat@gmail.com', '$2b$10$GBW4S4BzS00S5hKkS1Tbl.AGNTJWL6tSKdQJkxUfnqe7OhYn0exKO', '0988888888', 'Admin', 'HoatDong'),
(4, 'HUY LE 123', 'Huybui@gmail.com', '$2b$10$4WQEh.WkQAAPpQ/vaXh3F.aw6Q/l3BM1bWVh7pKmJon1DITJgBTCe', '099092323', 'KhachHang', 'HoatDong'),
(5, 'thanh dat', 'dat123@gmail.com', '123', '01993123123', 'NhanVien', 'HoatDong');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `sanpham`
--

CREATE TABLE `sanpham` (
  `MaSanPham` int(11) NOT NULL,
  `TenSanPham` varchar(255) NOT NULL,
  `MoTa` text DEFAULT NULL,
  `HinhAnhChinh` varchar(255) DEFAULT NULL,
  `GiaMacDinh` decimal(10,2) DEFAULT NULL,
  `MaDanhMuc` int(11) DEFAULT NULL,
  `MaThuongHieu` int(11) DEFAULT NULL,
  `TrangThai` enum('HoatDong','DaAn') DEFAULT 'HoatDong'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `sanpham`
--

INSERT INTO `sanpham` (`MaSanPham`, `TenSanPham`, `MoTa`, `HinhAnhChinh`, `GiaMacDinh`, `MaDanhMuc`, `MaThuongHieu`, `TrangThai`) VALUES
(1, 'Giày Chạy Bộ Nike Air Zoom', 'Giày chạy siêu nhẹ', 'nike-air.jpg', 2500000.00, 1, 1, 'HoatDong'),
(2, 'Balo Thể Thao Adidas', 'Balo chống nước', 'adidas-balo.jpg', 850000.00, 2, 2, 'HoatDong'),
(3, 'Giày Thể Thao Nike Air Max Chuyên Dụng', 'Thiết kế đế Air Max trợ lực tối đa.', 'nike-airmax-red.jpg', 2450000.00, 1, 1, 'HoatDong'),
(4, 'Giày Chạy Bộ Puma RS-X Trắng Xanh', 'Phong cách Retro năng động, đế êm ái.', 'puma-rsx-white.jpg', 1850000.00, 1, 3, 'HoatDong'),
(5, 'Balo Thể Thao Đa Năng Chống Nước SportFlex', 'Chất liệu vải Oxford chống thấm nước hoàn hảo.', 'sportflex-backpack.jpg', 650000.00, 6, NULL, 'HoatDong'),
(6, 'Thảm Tập Yoga Cao Su Non Chống Trượt', 'Độ dày 8mm, bám dính cực tốt.', 'yoga-mat.jpg', 450000.00, 3, NULL, 'HoatDong'),
(7, 'Giày Chạy Bộ Nike Zoom Fly 5', 'Đệm ZoomX cực nảy cho tốc độ tối đa.', 'nike-zoomfly-blue.jpg', 3200000.00, 1, 1, 'HoatDong'),
(8, 'Giày Tập Luyện Adidas Dropset', 'Đế bám chắc chắn cho cử tạ và gym.', 'adidas-dropset.jpg', 2890000.00, 1, 2, 'HoatDong'),
(9, 'Giày Chạy Bộ Nike Pegasus 40', 'Sự lựa chọn quốc dân cho chạy bộ hàng ngày.', 'nike-pegasus-green.jpg', 2750000.00, 1, 1, 'HoatDong'),
(10, 'Giày Thể Thao Đa Năng Biti\'s Hunter', 'Thương hiệu Việt, chất lượng cao cấp.', 'bitis-hunter-white.jpg', 850000.00, 1, 5, 'HoatDong'),
(11, 'Giày Thể Thao Nike Air Max Alpha Trainer 5', 'Giày tập luyện Nike Air Max Alpha Trainer 5 mang đến sức mạnh và sự ổn định cho những buổi tập tạ cường độ cao.\r\n\r\nĐẶC ĐIỂM NỔI BẬT:\r\n- Lớp đệm Max Air ở gót chân giúp hấp thụ lực va đập tuyệt vời, bảo vệ khớp.\r\n- Phần đế bằng phẳng, rộng rãi kết hợp với mặt gai cao su tăng cường độ bám trên mặt sàn phòng gym.\r\n- Chất liệu vải mesh (lưới) ở phần upper giúp bàn chân luôn khô thoáng dù tập luyện liên tục 2-3 tiếng.\r\n- Thiết kế cổ giày ôm sát, bảo vệ mắt cá chân hiệu quả khỏi các chấn thương lật sơ mi.\r\n\r\nPHÙ HỢP SỬ DỤNG:\r\n- Tập Gym, cử tạ (Weightlifting), CrossFit.\r\n- Chạy bộ nhẹ nhàng trên máy chạy.\r\n- Phối đồ đi chơi hàng ngày nhờ thiết kế cực kỳ thời trang và nam tính.', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80', 2450000.00, 1, 1, 'HoatDong'),
(12, 'aasd', '', 'http://127.0.0.1:5500/frontend/pages/Home.html', NULL, 1, NULL, 'HoatDong'),
(13, 'Giay test', 'gaiy', 'https://cdn.hstatic.net/products/1000061481/anh_sp_io8461-201-270426_25574c8111e1499bb540bb4417084527_1024x1024.jpg', NULL, 1, 2, 'HoatDong'),
(16, '123456', '124', 'https://cdn.hstatic.net/products/1000061481/avatar__1_of_24__d3c588c497d94c4d81e746140b964774_1024x1024.jpg', NULL, 1, NULL, 'HoatDong'),
(17, '123456', '234', 'https://cdn.hstatic.net/products/1000061481/avatar__1_of_24__d3c588c497d94c4d81e746140b964774_1024x1024.jpg', 140374.00, 5, 5, 'HoatDong');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thanhtoan`
--

CREATE TABLE `thanhtoan` (
  `MaThanhToan` int(11) NOT NULL,
  `MaDonHang` int(11) NOT NULL,
  `PhuongThuc` enum('COD','VNPAY') NOT NULL,
  `SoTien` decimal(10,2) NOT NULL,
  `MaGiaoDichDoiTac` varchar(255) DEFAULT NULL,
  `TrangThaiThanhToan` enum('ThanhCong','ThatBai','DangXuLy') NOT NULL,
  `NgayThanhToan` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuonghieu`
--

CREATE TABLE `thuonghieu` (
  `MaThuongHieu` int(11) NOT NULL,
  `TenThuongHieu` varchar(255) NOT NULL,
  `Logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thuonghieu`
--

INSERT INTO `thuonghieu` (`MaThuongHieu`, `TenThuongHieu`, `Logo`) VALUES
(1, 'Nike', 'nike-logo.png'),
(2, 'Adidas', 'adidas-logo.png'),
(3, 'Puma', 'puma-logo.png'),
(4, 'Under Armour', 'ua-logo.png'),
(5, 'Biti\'s Hunter', 'bitis-logo.png');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `bienthe_sanpham`
--
ALTER TABLE `bienthe_sanpham`
  ADD PRIMARY KEY (`MaBienThe`),
  ADD KEY `MaSanPham` (`MaSanPham`);

--
-- Chỉ mục cho bảng `chitiet_donhang`
--
ALTER TABLE `chitiet_donhang`
  ADD PRIMARY KEY (`MaChiTiet`),
  ADD KEY `MaDonHang` (`MaDonHang`),
  ADD KEY `MaBienThe` (`MaBienThe`);

--
-- Chỉ mục cho bảng `chitiet_giohang`
--
ALTER TABLE `chitiet_giohang`
  ADD PRIMARY KEY (`MaChiTietGH`),
  ADD KEY `MaGioHang` (`MaGioHang`),
  ADD KEY `MaBienThe` (`MaBienThe`);

--
-- Chỉ mục cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`MaDanhGia`),
  ADD KEY `MaSanPham` (`MaSanPham`),
  ADD KEY `MaNguoiDung` (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  ADD PRIMARY KEY (`MaDanhMuc`);

--
-- Chỉ mục cho bảng `diachi`
--
ALTER TABLE `diachi`
  ADD PRIMARY KEY (`MaDiaChi`),
  ADD KEY `MaNguoiDung` (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD PRIMARY KEY (`MaDonHang`),
  ADD UNIQUE KEY `MaTraCuu` (`MaTraCuu`),
  ADD KEY `MaNguoiDung` (`MaNguoiDung`),
  ADD KEY `MaDiaChi` (`MaDiaChi`);

--
-- Chỉ mục cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD PRIMARY KEY (`MaGioHang`),
  ADD UNIQUE KEY `MaNguoiDung` (`MaNguoiDung`);

--
-- Chỉ mục cho bảng `hinhanh_sanpham`
--
ALTER TABLE `hinhanh_sanpham`
  ADD PRIMARY KEY (`MaAnh`),
  ADD KEY `MaSanPham` (`MaSanPham`);

--
-- Chỉ mục cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  ADD PRIMARY KEY (`MaNguoiDung`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Chỉ mục cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`MaSanPham`),
  ADD KEY `MaDanhMuc` (`MaDanhMuc`),
  ADD KEY `MaThuongHieu` (`MaThuongHieu`);

--
-- Chỉ mục cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD PRIMARY KEY (`MaThanhToan`),
  ADD KEY `MaDonHang` (`MaDonHang`);

--
-- Chỉ mục cho bảng `thuonghieu`
--
ALTER TABLE `thuonghieu`
  ADD PRIMARY KEY (`MaThuongHieu`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `bienthe_sanpham`
--
ALTER TABLE `bienthe_sanpham`
  MODIFY `MaBienThe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `chitiet_donhang`
--
ALTER TABLE `chitiet_donhang`
  MODIFY `MaChiTiet` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `chitiet_giohang`
--
ALTER TABLE `chitiet_giohang`
  MODIFY `MaChiTietGH` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `MaDanhGia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `danhmuc`
--
ALTER TABLE `danhmuc`
  MODIFY `MaDanhMuc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `diachi`
--
ALTER TABLE `diachi`
  MODIFY `MaDiaChi` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `donhang`
--
ALTER TABLE `donhang`
  MODIFY `MaDonHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `giohang`
--
ALTER TABLE `giohang`
  MODIFY `MaGioHang` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `hinhanh_sanpham`
--
ALTER TABLE `hinhanh_sanpham`
  MODIFY `MaAnh` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `nguoidung`
--
ALTER TABLE `nguoidung`
  MODIFY `MaNguoiDung` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `MaSanPham` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  MODIFY `MaThanhToan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `thuonghieu`
--
ALTER TABLE `thuonghieu`
  MODIFY `MaThuongHieu` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `bienthe_sanpham`
--
ALTER TABLE `bienthe_sanpham`
  ADD CONSTRAINT `bienthe_sanpham_ibfk_1` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `chitiet_donhang`
--
ALTER TABLE `chitiet_donhang`
  ADD CONSTRAINT `chitiet_donhang_ibfk_1` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitiet_donhang_ibfk_2` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthe_sanpham` (`MaBienThe`) ON DELETE NO ACTION;

--
-- Các ràng buộc cho bảng `chitiet_giohang`
--
ALTER TABLE `chitiet_giohang`
  ADD CONSTRAINT `chitiet_giohang_ibfk_1` FOREIGN KEY (`MaGioHang`) REFERENCES `giohang` (`MaGioHang`) ON DELETE CASCADE,
  ADD CONSTRAINT `chitiet_giohang_ibfk_2` FOREIGN KEY (`MaBienThe`) REFERENCES `bienthe_sanpham` (`MaBienThe`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `danhgia_ibfk_1` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE,
  ADD CONSTRAINT `danhgia_ibfk_2` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `diachi`
--
ALTER TABLE `diachi`
  ADD CONSTRAINT `diachi_ibfk_1` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `donhang`
--
ALTER TABLE `donhang`
  ADD CONSTRAINT `donhang_ibfk_1` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE SET NULL,
  ADD CONSTRAINT `donhang_ibfk_2` FOREIGN KEY (`MaDiaChi`) REFERENCES `diachi` (`MaDiaChi`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `giohang`
--
ALTER TABLE `giohang`
  ADD CONSTRAINT `giohang_ibfk_1` FOREIGN KEY (`MaNguoiDung`) REFERENCES `nguoidung` (`MaNguoiDung`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `hinhanh_sanpham`
--
ALTER TABLE `hinhanh_sanpham`
  ADD CONSTRAINT `hinhanh_sanpham_ibfk_1` FOREIGN KEY (`MaSanPham`) REFERENCES `sanpham` (`MaSanPham`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `sanpham`
--
ALTER TABLE `sanpham`
  ADD CONSTRAINT `sanpham_ibfk_1` FOREIGN KEY (`MaDanhMuc`) REFERENCES `danhmuc` (`MaDanhMuc`) ON DELETE SET NULL,
  ADD CONSTRAINT `sanpham_ibfk_2` FOREIGN KEY (`MaThuongHieu`) REFERENCES `thuonghieu` (`MaThuongHieu`) ON DELETE SET NULL;

--
-- Các ràng buộc cho bảng `thanhtoan`
--
ALTER TABLE `thanhtoan`
  ADD CONSTRAINT `thanhtoan_ibfk_1` FOREIGN KEY (`MaDonHang`) REFERENCES `donhang` (`MaDonHang`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
