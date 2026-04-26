"use client";

import { useState } from "react";
import BookGrid from "@/components/BookGrid";
import { Tabs, Button } from "antd";
import { useAuth } from "@/context/auth";
import { SettingOutlined } from "@ant-design/icons";
import Link from "next/link";

// Mock data - Sách Hot
const sachHot = [
  {
    id: 1,
    bookName: "Mèo Mập Béo Bự",
    bookCover: "https://images.unsplash.com/photo-1507842217343-583b8c8a8451?w=300&h=400&fit=crop",
    chapter: 398,
    genres: ["Drama", "Học Đường"],
    description: "Một người dùng có khả năng bị ảnh hưởng bên ấn định giáo bên trong cơ thể của một con mèo...",
    rating: 4,
    views: 26632023,
    followers: 27635,
  },
  {
    id: 2,
    bookName: "Đại Quân Gia Là Ma Hoàng",
    bookCover: "https://images.unsplash.com/photo-1490079002776-d70f75dbd0b6?w=300&h=400&fit=crop",
    chapter: 845,
    genres: ["Hành Động", "Phiêu Lưu"],
    description: "Zhuo Yifan là một hoàng đế ma thuật hay có thể gọi là quý hoàng ông con pháp cơn bị học trò của mình phần...",
    rating: 4,
    views: 18047601,
    followers: 25146,
  },
];

// Mock data - Truyện Online
const truyenOnline = [
  {
    id: 3,
    bookName: "Nano Ma Thần",
    bookCover: "https://images.unsplash.com/photo-1544716278-ca5e3af4abd8?w=300&h=400&fit=crop",
    chapter: 309,
    genres: ["Manhwa", "Võ Thuật"],
    description: "(Nano Machine) Tân bình một trong làng truyện tranh Võ hiệp Hàn Quốc, trình làng một được 3 tuần...",
    rating: 4,
    views: 12140824,
    followers: 30812,
  },
  {
    id: 4,
    bookName: "Kỵ Sĩ Bá Nhất Thế Giới",
    bookCover: "https://images.unsplash.com/photo-1516979187457-635ffe35ebdb?w=300&h=400&fit=crop",
    chapter: 222,
    genres: ["Hành Động", "Hải Hước"],
    description: "Kim Suho, vốn là một kỵ sĩ xây dựng, đã trở thành Quỳ tộc trong một cuộc tiêu thuyết...",
    rating: 5,
    views: 11225000,
    followers: 35652,
  },
  {
    id: 5,
    bookName: "Hoán Đổi Diều Kì",
    bookCover: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=300&h=400&fit=crop",
    chapter: 603,
    genres: ["Drama", "Học Đường"],
    description: "Park Hyung Suk, béo và xấu xí, luôn bị lời ra làm trò cười và bất nạt ở trường...",
    rating: 5,
    views: 8915270,
    followers: 15302,
  },
  {
    id: 6,
    bookName: "Ta Trời Sinh Đã Là Nhân Vật Phiên Diện",
    bookCover: "https://images.unsplash.com/photo-1511185612332-f56ec3579340?w=300&h=400&fit=crop",
    chapter: 337,
    genres: ["Manhwa", "Võ Thuật"],
    description: "Có Trương Ca xuyên không trở thành nhân vật phiên diện, làm thiều chủ một trương sinh thế giả...",
    rating: 4,
    views: 8284874,
    followers: 20108,
  },
];

// Mock data - Sách Truyện
const sachTruyen = [
  {
    id: 7,
    bookName: "Võ Luyện Định Phong",
    bookCover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop",
    chapter: 3860,
    genres: ["Phiêu Lưu", "Võ Thuật"],
    description: "Võ đạo định phong, là có độc, là tích mích, là đại đắng đắng cầu tác, là cao xử bất thắng hạn...",
    rating: 4,
    views: 7292185,
    followers: 5335,
  },
  {
    id: 8,
    bookName: "Ban Học Của Tôi Là Linh Dánh Thuế",
    bookCover: "https://images.unsplash.com/photo-1507842217343-583b8c8a8451?w=300&h=400&fit=crop",
    chapter: 280,
    genres: ["Manhwa", "Webtoons"],
    description: "Yu Ijin - người duy nhất sống sót sau một vu tai năn mây bay thảm khốc khi anh còn nhỏ...",
    rating: 4,
    views: 6949474,
    followers: 19957,
  },
  {
    id: 9,
    bookName: "Chuyên Sinh Thành Liễu Độc Biến",
    bookCover: "https://images.unsplash.com/photo-1516979187457-635ffe35ebdb?w=300&h=400&fit=crop",
    chapter: 513,
    genres: ["Phiêu Lưu", "Hành Động"],
    description: "Ngu Từ Du bị chiết sâc rồi chuyên sinh thành một cây liễu độc biến và bắt đầu hành trình phiêu lưu...",
    rating: 5,
    views: 6213944,
    followers: 13655,
  },
  {
    id: 10,
    bookName: "Thăng Cấp Võ Hạn Trong Murim",
    bookCover: "https://images.unsplash.com/photo-1517457373614-b7152f800fd1?w=300&h=400&fit=crop",
    chapter: 262,
    genres: ["Phiêu Lưu", "Văn Tương"],
    description: "Tang Yoo Sung, một chiến binh cấp dưới không có tài năng hoạc trình độ...",
    rating: 4,
    views: 6155176,
    followers: 16959,
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const { isAdmin } = useAuth();

  const tabItems = [
    {
      key: "all",
      label: "TẤT CẢ",
      children: (
        <div className="space-y-12">
          <BookGrid books={sachHot} type="sach" title="📚 Sách Hot" />
          <div className="border-t border-gray-700"></div>
          <BookGrid books={truyenOnline} type="truyen" title="🔥 Truyện Tranh Online" />
          <div className="border-t border-gray-700"></div>
          <BookGrid books={sachTruyen} type="sach" title="📖 Sách Truyện" />
        </div>
      ),
    },
    {
      key: "popular",
      label: "TRUYỆN HAY",
      children: (
        <div className="space-y-12">
          <BookGrid books={truyenOnline.sort((a, b) => b.rating - a.rating)} type="truyen" title="⭐ Truyện Hay Nhất" />
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Admin Quick Access Bar */}
      {isAdmin && (
        <div className="bg-yellow-500 p-2 text-center flex justify-center items-center gap-4">
          <span className="font-bold text-gray-900">🔔 Bạn đang đăng nhập với quyền ADMIN</span>
          <Link href="/admin">
            <Button type="primary" size="small" icon={<SettingOutlined />} className="bg-gray-900 border-none">
              Vào Dashboard
            </Button>
          </Link>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Chào mừng đến DanComic</h1>
          <p className="text-lg text-red-100">
            Khám phá hàng ngàn truyện tranh và sách truyện từ khắp nơi trên thế giới
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="dancomic-tabs"
          tabBarStyle={{
            backgroundColor: "transparent",
            borderBottom: "2px solid #374151",
          }}
        />
      </div>
    </div>
  );
}
