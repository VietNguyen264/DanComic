"use client";

import { useState, useEffect } from "react";
import BookGrid from "@/components/BookGrid";
import ScrollToTop from "@/components/ScrollToTop";
import { Select, Row, Col, Spin } from "antd";
import comicService from "@/services/comic/comic.service";

const ITEMS_PER_PAGE = 12;

export default function TruyenPage() {
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch comics từ API
  const fetchComics = async () => {
    try {
      setLoading(true);
      const comicsData = await comicService.getAllComics();
      
      // Map dữ liệu từ API
      const mappedComics = (comicsData || []).map((comic: any) => ({
        id: comic.comicId || comic.id,
        bookName: comic.comicName,
        bookCover: comic.comicCover,
        chapter: comic.chapter || 0,
        genres: comic.comicGenre ? [comic.comicGenre] : [],
        description: comic.comicDescription,
        rating: comic.rating || 4,
        views: comic.views || 0,
        followers: comic.followers || 0,
      }));
      
      setComics(mappedComics);
    } catch (error) {
      console.error("Failed to fetch comics:", error);
      setComics([]);
    } finally {
      setLoading(false);
    }
  };

  // Load comics on mount
  useEffect(() => {
    fetchComics();
  }, []);

  const filteredComics = selectedGenre
    ? comics.filter((comic) => comic.genres.includes(selectedGenre))
    : comics;

  const totalPages = Math.ceil(filteredComics.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedComics = filteredComics.slice(startIndex, endIndex);

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

  // Collect all unique genres from comics
  const genres = Array.from(
    new Set(comics.flatMap((comic: any) => comic.genres))
  ).sort() as string[];

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
        {loading ? (
          <div className="flex justify-center py-12">
            <Spin size="large" />
          </div>
        ) : filteredComics.length > 0 ? (
          <>
            <BookGrid
              books={displayedComics}
              type="truyen"
              title={`Hiển thị ${startIndex + 1} - ${Math.min(endIndex, filteredComics.length)} trong ${filteredComics.length} truyện tranh`}
            />
            
            {/* Pagination Buttons */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                {/* Previous Button */}
                {currentPage > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="px-3 py-2 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
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
                          ? "bg-red-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                    className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    →
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-gray-400 py-12">Không có truyện tranh nào</div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}
