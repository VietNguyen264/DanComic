"use client";

import { useState, useEffect } from "react";
import BookGrid from "@/components/BookGrid";
import ScrollToTop from "@/components/ScrollToTop";
import { Select, Row, Col, Spin, Button } from "antd";
import { DownloadOutlined, ArrowUpOutlined } from "@ant-design/icons";
import comicService from "@/services/comic/comic.service";

export default function TruyenPage() {
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);

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

  // Display only displayCount items
  const displayedComics = filteredComics.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  const handleShowLess = () => {
    setDisplayCount(12);
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
              title={`Hiển thị ${displayedComics.length} / ${filteredComics.length} truyện tranh`}
            />
            
            {displayCount < filteredComics.length && (
              <div className="flex justify-center gap-4 py-8">
                {displayCount > 12 && (
                  <Button
                    size="large"
                    icon={<ArrowUpOutlined />}
                    onClick={handleShowLess}
                    className="border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    Trở về
                  </Button>
                )}
                <Button
                  type="primary"
                  size="large"
                  icon={<DownloadOutlined />}
                  onClick={handleLoadMore}
                  className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700"
                >
                  Xem Thêm ({filteredComics.length - displayCount} truyện còn lại)
                </Button>
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
