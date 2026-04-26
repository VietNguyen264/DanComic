"use client";

import Link from "next/link";
import { Button } from "antd";

export default function NotFound() {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-9xl font-bold text-red-600 mb-4">404</div>
        <h1 className="text-4xl font-bold text-white mb-2">Không Tìm Thấy Trang</h1>
        <p className="text-xl text-gray-400 mb-8">
          Xin lỗi, trang bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        <div className="space-y-4 max-w-sm mx-auto">
          <p className="text-gray-300">
            Đừng lo lắng! Bạn có thể trở lại trang chủ hoặc khám phá các khu vực khác của DanComic.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/">
              <Button
                type="primary"
                size="large"
                className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              >
                Trở Về Trang Chủ
              </Button>
            </Link>
            <Link href="/danh-sach/truyen">
              <Button size="large">
                Khám Phá Truyện
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="mt-16 text-6xl">
          📖 😕 📚
        </div>
      </div>
    </div>
  );
}
