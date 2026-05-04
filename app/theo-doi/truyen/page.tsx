"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Empty, Spin, Row, Col, message, Modal, Popconfirm } from "antd";
import { ArrowLeftOutlined, DeleteOutlined } from "@ant-design/icons";
import BookCard from "@/components/BookCard";
import ScrollToTop from "@/components/ScrollToTop";
import comicService from "@/services/comic/comic.service";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

interface BookmarkedComic {
  id: string;
  name: string;
  date: string;
}

const ITEMS_PER_PAGE = 12;

export default function TheoDoinTruyenPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [bookmarkedComics, setBookmarkedComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Load bookmarked comics
  useEffect(() => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để xem danh sách theo dõi");
      router.push("/auth/login");
      return;
    }

    const loadBookmarks = async () => {
      try {
        setLoading(true);
        
        // Get bookmarks from localStorage
        const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}") as Record<string, BookmarkedComic>;
        
        if (Object.keys(bookmarks).length === 0) {
          setBookmarkedComics([]);
          setLoading(false);
          return;
        }

        // Fetch all comics from API
        const allComics = await comicService.getAllComics();
        
        // Filter and map only bookmarked comics
        const mapped = (allComics || [])
          .filter((comic: any) => bookmarks[comic.comicId || comic.id])
          .map((comic: any) => ({
            id: comic.comicId || comic.id,
            bookName: comic.comicName,
            bookCover: comic.comicCover,
            chapter: comic.chapter || 0,
            genres: comic.comicGenre ? [comic.comicGenre] : [],
            description: comic.comicDescription,
            rating: comic.rating || 4,
            views: comic.views || 0,
            followers: comic.followers || 0,
            bookmarkedDate: bookmarks[comic.comicId || comic.id].date,
          }))
          // Sort by bookmarked date (newest first)
          .sort((a: any, b: any) => new Date(b.bookmarkedDate).getTime() - new Date(a.bookmarkedDate).getTime());

        setBookmarkedComics(mapped);
      } catch (error) {
        console.error("Failed to load bookmarks:", error);
        message.error("Lỗi khi tải danh sách theo dõi");
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [isLoggedIn, router]);

  const totalPages = Math.ceil(bookmarkedComics.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const displayedComics = bookmarkedComics.slice(startIndex, endIndex);

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

  const handleRemoveBookmark = (comicId: string) => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
    delete bookmarks[comicId];
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setBookmarkedComics(bookmarkedComics.filter(comic => comic.id !== comicId));
    message.success("Đã bỏ theo dõi truyện");
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (bookmarkedComics.length === 0) {
    return (
      <div className="bg-gray-900 min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/danh-sach/truyen">
                <Button type="primary" icon={<ArrowLeftOutlined />}>
                  Quay lại
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2">Truyện Đã Theo Dõi</h1>
            <p className="text-lg text-purple-100">
              Quản lý danh sách các truyện bạn đang theo dõi
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Empty
            description={<span className="text-gray-300">Chưa có truyện nào được theo dõi</span>}
            className="text-white"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link href="/danh-sach/truyen">
              <Button type="primary" danger>
                Khám phá truyện
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/danh-sach/truyen">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">Truyện Đã Theo Dõi</h1>
          <p className="text-lg text-purple-100">
            Quản lý danh sách các truyện bạn đang theo dõi ({bookmarkedComics.length})
          </p>
        </div>
      </div>

      {/* Comics List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {displayedComics.map((comic) => (
            <div key={comic.id} className="flex items-stretch gap-2">
              <div className="flex-1">
                <BookCard
                  id={comic.id}
                  bookName={comic.bookName}
                  bookCover={comic.bookCover}
                  chapter={comic.chapter}
                  genres={comic.genres}
                  description={comic.description}
                  rating={comic.rating}
                  views={comic.views}
                  followers={comic.followers}
                  type="truyen"
                />
              </div>
              <div className="flex items-center">
                <Popconfirm
                  title="Bỏ theo dõi"
                  description="Bạn có chắc chắn muốn bỏ theo dõi truyện này?"
                  onConfirm={() => handleRemoveBookmark(comic.id)}
                  okText="Có"
                  cancelText="Không"
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    className="self-center"
                  >
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button onClick={handlePrevious} disabled={currentPage === 0}>
              Trang trước
            </Button>
            <span className="text-white">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <Button onClick={handleNext} disabled={currentPage === totalPages - 1}>
              Trang sau
            </Button>
          </div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
}
