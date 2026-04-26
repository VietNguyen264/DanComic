"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold text-red-600 mb-4">DanComic</h3>
            <p className="text-gray-300">
              Nền tảng đọc truyện tranh online và mua bán sách truyện chất lượng cao.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-red-600 transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="/danh-sach/truyen" className="hover:text-red-600 transition-colors">
                  Truyện Online
                </a>
              </li>
              <li>
                <a href="/danh-sach/sach" className="hover:text-red-600 transition-colors">
                  Sách
                </a>
              </li>
              <li>
                <a href="/lien-he" className="hover:text-red-600 transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>
            <p className="text-gray-300 mb-2">Email: contact@dancomic.com</p>
            <p className="text-gray-300">Điện thoại: +84 (0) 123 456 789</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-300">
            Copyright © {currentYear} DanComic. All rights reserved.
          </p>
          <p className="text-center text-gray-400 text-sm mt-2">
            Designed and developed by Nguyễn Quốc Việt
          </p>
        </div>
      </div>
    </footer>
  );
}
