"use client";

import { useState } from "react";
import BookGrid from "@/components/BookGrid";
import { Select, Row, Col } from "antd";

const allBooks = [
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
  {
    id: 11,
    bookName: "Hoàn Thành Tiểu Thuyết Lãng Mạn",
    bookCover: "https://images.unsplash.com/photo-1516979187457-635ffe35ebdb?w=300&h=400&fit=crop",
    chapter: 456,
    genres: ["Lãng Mạn", "Hài Hước"],
    description: "Một câu chuyện tình yêu đầy cảm xúc và tình cảm...",
    rating: 5,
    views: 5432100,
    followers: 12345,
  },
];

export default function SachPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const filteredBooks = selectedGenre
    ? allBooks.filter((book) => book.genres.includes(selectedGenre))
    : allBooks;

  const genres = ["Drama", "Học Đường", "Hành Động", "Phiêu Lưu", "Lãng Mạn", "Hài Hước"];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Thư Viện Sách</h1>
          <p className="text-lg text-blue-100">
            Khám phá hàng ngàn cuốn sách truyện chất lượng cao từ các tác giả nổi tiếng
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={16} className="mb-8">
          <Col xs={24} sm={12}>
            <h3 className="font-semibold text-gray-700 mb-2">Lọc theo thể loại:</h3>
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
            <h3 className="font-semibold text-gray-700 mb-2">Sắp xếp:</h3>
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

        {/* Books Grid */}
        <BookGrid
          books={filteredBooks}
          type="sach"
          title={`Tìm thấy ${filteredBooks.length} cuốn sách`}
        />
      </div>
    </div>
  );
}
