"use client";

import { useState, useEffect } from "react";
import BookGrid from "@/components/BookGrid";
import ScrollToTop from "@/components/ScrollToTop";
import { Select, Row, Col, Spin } from "antd";
import bookService from "@/services/book/book.service";

const ITEMS_PER_PAGE = 12;

export default function SachPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

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

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedBooks = filteredBooks.slice(startIndex, endIndex);

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
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
              title={`Hiển thị ${startIndex + 1} - ${Math.min(endIndex, filteredBooks.length)} trong ${filteredBooks.length} cuốn sách`}
            />
            
            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {/* Previous Button */}
                {currentPage > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-3 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                  >
                    ←
                  </button>
                )}

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handlePageClick(index)}
                      className={`w-10 h-10 rounded flex items-center justify-center font-medium transition-colors ${
                        index === currentPage
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNext}
                    className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    →
                  </button>
                )}
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
