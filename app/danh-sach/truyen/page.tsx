"use client";

import { useState } from "react";
import BookGrid from "@/components/BookGrid";
import { Select, Row, Col } from "antd";

const allComics = [
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
  {
    id: 12,
    bookName: "Kỵ Sĩ Thời Nay",
    bookCover: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop",
    chapter: 128,
    genres: ["Hành Động", "Manga"],
    description: "Một tác phẩm hành động đầy kịch tính với tuyệt chiêu đặc sắc...",
    rating: 4,
    views: 4321000,
    followers: 8765,
  },
];

export default function TruyenPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredComics = selectedGenre
    ? allComics.filter((comic) => comic.genres.includes(selectedGenre))
    : allComics;

  const genres = ["Manhwa", "Manga", "Võ Thuật", "Hành Động", "Drama", "Học Đường", "Hài Hước"];

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Truyện Tranh Online</h1>
          <p className="text-lg text-purple-100">
            Đọc ngay các truyện tranh hot nhất từ Hàn Quốc, Trung Quốc và Nhật Bản
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={16} className="mb-8">
          <Col xs={24} sm={12}>
            <h3 className="font-semibold text-white mb-2">Lọc theo thể loại:</h3>
            <Select
              placeholder="Chọn thể loại"
              value={selectedGenre}
              onChange={setSelectedGenre}
              allowClear
              style={{ width: "100%" }}
              options={genres.map((genre) => ({
                label: genre,
                value: genre,
              }))}
            />
          </Col>
          <Col xs={24} sm={12}>
            <h3 className="font-semibold text-white mb-2">Sắp xếp:</h3>
            <Select
              placeholder="Chọn cách sắp xếp"
              style={{ width: "100%" }}
              options={[
                { label: "Mới nhất", value: "new" },
                { label: "Đánh giá cao", value: "rating" },
                { label: "Lượt xem nhiều", value: "views" },
              ]}
            />
          </Col>
        </Row>

        {/* Comics Grid */}
        <BookGrid
          books={filteredComics}
          type="truyen"
          title={`Tìm thấy ${filteredComics.length} truyện tranh`}
        />
      </div>
    </div>
  );
}
