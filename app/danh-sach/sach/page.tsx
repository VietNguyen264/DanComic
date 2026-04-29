"use client";

import { useState, useEffect } from "react";
import BookGrid from "@/components/BookGrid";
import ScrollToTop from "@/components/ScrollToTop";
import { Select, Row, Col, Spin, Button } from "antd";
import { DownloadOutlined, ArrowUpOutlined } from "@ant-design/icons";
import bookService from "@/services/book/book.service";

export default function SachPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);

  // Fetch books từ API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      
      // Map dữ liệu từ API
      const mappedBooks = (booksData || []).map((book: any) => ({
        id: book.bookId || book.id,
        bookName: book.bookName,
        bookCover: book.bookCover,
        chapter: book.chapter || 0,
        genres: book.bookGenre ? [book.bookGenre] : [],
        description: book.bookDescription,
        rating: book.rating || 4,
        views: book.views || 0,
        followers: book.followers || 0,
        bookPrice: book.bookPrice,
      }));
      
      setBooks(mappedBooks);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // Load books on mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const filteredBooks = selectedGenre
    ? books.filter((book) => book.genres.includes(selectedGenre))
    : books;

  // Display only displayCount items
  const displayedBooks = filteredBooks.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setDisplayCount(12);
  };

  // Collect all unique genres from books
  const genres = Array.from(
    new Set(books.flatMap((book: any) => book.genres))
  ).sort() as string[];

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Thư Viện Sách</h1>
          <p className="text-lg text-blue-100">
            Khám phá vô vàn sách truyện - tiểu thuyết hay và nổi tiếng
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
        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : filteredBooks.length > 0 ? (
          <>
            <BookGrid
              books={displayedBooks}
              type="sach"
              title={`Hiển thị ${displayedBooks.length} / ${filteredBooks.length} cuốn sách`}
            />
            
            {displayCount < filteredBooks.length && (
              <div className="flex justify-center gap-4 py-8">
                {displayCount > 12 && (
                  <Button
                    size="large"
                    icon={<ArrowUpOutlined />}
                    onClick={handleShowLess}
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Trở về
                  </Button>
                )}
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleLoadMore}
                  className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
                >
                  Xem Thêm ({filteredBooks.length - displayCount} cuốn còn lại)
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">Không có sách nào</div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}
