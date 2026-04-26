Chào bạn, yêu cầu của bạn về việc định dạng lại tài liệu đặc tả dự án theo định dạng Markdown đã được thực hiện. Tôi đã cập nhật phần "Thiết kế Giao diện Trang chủ" để phản ánh chính xác cấu trúc hiển thị theo dạng lưới (grid) 2 cột như trong ảnh mẫu bạn cung cấp.

Dưới đây là tệp Markdown hoàn chỉnh, sạch sẽ và dễ đọc hơn:

---

# Tài Liệu Đặc Tả Dự Án: DanComic

## 1. Cấu trúc Thư mục Gốc (Root Directory)
Dự án được xây dựng trên framework **Next.js**, cấu trúc thư mục được đề xuất như sau:

/dancomic
├── /app                  # Next.js App Router (Thư mục chính)
│   ├── /danh-sach        # Route cha cho danh sách
│   │   ├── /sach         # Trang thư viện bán lẻ sách (Nền trắng)
│   │   └── /truyen       # Trang đọc truyện online (Nền đen)
│   ├── /auth             # Route xử lý Đăng nhập / Đăng ký / Quên mật khẩu
│   ├── /lien-he          # Trang liên hệ và phản hồi
│   ├── layout.tsx        # Layout tổng (chứa Navbar & Footer)
│   ├── page.tsx          # Trang chủ (Home)
│   ├── globals.css       # Cấu hình CSS/Tailwind toàn cục
│   └── not-found.tsx     # Trang lỗi 404 tùy chỉnh (đẹp mắt)
├── /components           # Các UI Components tái sử dụng (Card, Button,...)
├── /public               # Chứa Logo DanComic, Assets, Icons
├── tailwind.config.ts    # Cấu hình màu sắc Đen/Trắng chủ đạo
├── next.config.ts        # Cấu hình Next.js
└── package.json          # Quản lý dependencies
---

## 2. Thiết kế Giao diện Trang chủ
Giao diện Trang chủ được thiết kế theo dạng lưới (grid) để hiển thị danh sách truyện, tuân thủ theo bố cục của ảnh mẫu:

* **Tab Bar/Bảng chọn:** Nằm ở trên cùng, bao gồm các mục như **TẤT CẢ** (màu đỏ, được chọn mặc định), **TRUYỆN HAY**, và có thể có thêm các mục khác.
* **Bố cục hiển thị:** Danh sách truyện được trình bày dưới dạng lưới **2 cột** (như `image_0.png` và `image_1.png`). Mỗi dòng trong lưới chứa 2 ô truyện.
    * Tổng số truyện hiển thị trên trang chủ cần tuân thủ yêu cầu: 1 hàng cho "Sách Hot", 2 hàng cho "Truyện tranh Online", 2 hàng cho "Sách truyện" (mỗi hàng có thể coi là một nhóm 2 hàng-ô truyện để đạt đủ số lượng item).
* **Đường phân cách:** Một nét gạch ngang (horizontal rule) rõ rệt để phân chia khu vực "Mẫu truyện/Sách Hot" với các phần khác.
* **Cấu trúc mỗi ô truyện (Item Card):** Mỗi ô truyện được thiết kế đồng nhất và bao gồm các thông tin:
    * **Bìa truyện:** Hình ảnh bìa ở bên trái.
    * **Thông tin truyện:** Nằm ở bên phải bìa, bao gồm:
        * Số chương (ví dụ: "398 Chương").
        * Tên truyện (ví dụ: "Mèo Mập Béo Bự").
        * Thể loại (gắn tag màu xám, ví dụ: "Drama", "Học Đường").
        * Đoạn mô tả ngắn (giới thiệu nội dung).
        * Thống kê: Đánh giá sao (ví dụ: ⭐4), Lượt xem (ví dụ: 👁️ 26,632,023), Số người theo dõi (ví dụ: 👥 27,635).
        * Nút **ĐỌC TRUYỆN** (màu đỏ).
* **Các phần bổ sung (tùy chọn theo thiết kế):**
    * Thanh điều hướng phân trang (`< >`) để chuyển xem danh sách tiếp theo.
    * Tiêu đề cho các phần khác (ví dụ: "Truyện Mới") với danh sách lưới tương tự phía dưới.

---

## 3. Thanh điều hướng (Navbar) & Header
* **Logo:** Chữ **"DanComic"** nằm bên trái, nhấp vào trỏ về Trang chủ.
* **Menu:**
    1.  **Trang chủ:** Trỏ về trang chính.
    2.  **Danh sách:** Menu thả xuống (Dropdown) gồm:
        * **Sách:** Trỏ đến thư viện bán lẻ (Giao diện nền trắng).
        * **Truyện Online:** Trỏ đến khu vực đọc truyện (Giao diện nền đen).
        * *Tính năng:* Cả hai đều có bộ lọc thể loại (Hành động, Manga, Manhua, Manhwa...).
    3.  **Liên hệ:** Form gồm Textbox nhập ý kiến và Email gửi đến Admin.
* **User Action:** Logo người dùng để **Đăng ký/Đăng nhập**.

---

## 4. Hệ thống Tài khoản & Xác thực
### Đăng ký
* Thông tin: Mail, Số điện thoại, Biệt danh, Mật khẩu, Xác nhận mật khẩu.
### Đăng nhập
* Thông tin: Mail/Số điện thoại, Mật khẩu.
* **Quên mật khẩu:**
    * B1: Gửi yêu cầu xác nhận về Mail.
    * B2: Thông báo "ĐÃ GỬI XÁC NHẬN VỀ MAIL".
    * B3: Hiện Textbox nhập mật khẩu mới và xác nhận mật khẩu mới.

---

## 5. Quản lý Dữ liệu (CRUD)
Các Item (Sách/Truyện) sử dụng chung cấu trúc dữ liệu cơ bản:
* **Thông tin chung:** Tên, Thể loại.
* **Đặc thù Truyện Online:** Tình trạng (Cập nhật chương mới).
* **Đặc thù Sách bán lẻ:** Giá bán, Số lượng tồn kho.

---

## 6. Footer
* Nội dung: **Copyright © [Họ và tên của bạn]**
* Thông tin liên hệ: **Email cá nhân**.

---

## 7. Yêu cầu Kỹ thuật khác
* **Chủ đề (Theme):**
    * Khu vực truyện tranh: Nền Đen.
    * Khu vực bán sách/tiểu thuyết: Nền Trắng.
* **Trang 404:** Thiết kế bắt mắt, chuyên nghiệp.
* **Responsive:** Hiển thị tốt trên Mobile, Tablet và Desktop.
* **Triển khai:** Tối ưu hóa mã nguồn để chạy mượt mà khi deploy lên **Vercel** thông qua **GitHub**.

---
