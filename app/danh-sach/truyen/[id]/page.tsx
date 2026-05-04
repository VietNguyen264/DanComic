"use client";

import { useEffect, useState } from "react";
import { Button, Spin, message, Rate, Tabs, Modal, Divider } from "antd";
import { 
  ArrowLeftOutlined, 
  HeartOutlined, 
  HeartFilled,
  EyeOutlined,
  BookOutlined,
  StarOutlined,
  StarFilled
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import comicService, { ComicType } from "@/services/comic/comic.service";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth";

// Mock chapters data - trong thực tế này sẽ từ API
const generateMockChapters = (comicName: string) => {
  const chapters = [];
  for (let i = 1; i <= 50; i++) {
    chapters.push({
      id: i.toString(),
      number: i,
      title: `Chương ${i}`,
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("vi-VN"),
    });
  }
  return chapters.reverse(); // Newest first
};

export default function ComicDetailPage() {
  const params = useParams();
  const comicId = params.id as string;
  const { isLoggedIn } = useAuth();
  const [comic, setComic] = useState<ComicType | null>(null);
  const [loading, setLoading] = useState(true);
  const [chapters, setChapters] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [readingChapter, setReadingChapter] = useState<number | null>(null);

  useEffect(() => {
    const fetchComic = async () => {
      if (!comicId) return;
      setLoading(true);
      try {
        const data = await comicService.getComicById(comicId);
        if (data) {
          setComic(data);
          // Generate mock chapters
          const mockChapters = generateMockChapters(data.comicName);
          setChapters(mockChapters);
          
          // Load bookmark status from localStorage
          const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
          setIsBookmarked(!!bookmarks[comicId]);
          
          // Load user rating from localStorage
          const ratings = JSON.parse(localStorage.getItem("comicRatings") || "{}");
          setUserRating(ratings[comicId] || 0);
        } else {
          message.error("Không tìm thấy truyện");
        }
      } catch (error) {
        console.error("Error fetching comic:", error);
        message.error("Lỗi khi tải truyện");
      } finally {
        setLoading(false);
      }
    };

    fetchComic();
  }, [comicId]);

  const handleBookmark = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để sử dụng tính năng này");
      return;
    }
    
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
    if (isBookmarked) {
      delete bookmarks[comicId];
      message.success("Đã bỏ theo dõi truyện");
    } else {
      bookmarks[comicId] = {
        id: comicId,
        name: comic?.comicName,
        date: new Date().toISOString(),
      };
      message.success("Đã thêm vào danh sách theo dõi");
    }
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    setIsBookmarked(!isBookmarked);
  };

  const handleRating = (value: number) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để đánh giá");
      return;
    }
    
    const ratings = JSON.parse(localStorage.getItem("comicRatings") || "{}");
    ratings[comicId] = value;
    localStorage.setItem("comicRatings", JSON.stringify(ratings));
    setUserRating(value);
    message.success(`Bạn đã đánh giá ${value} sao`);
  };

  const handleReadChapter = (chapterNumber: number) => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để đọc truyện");
      return;
    }
    message.info(`Chuyển đến chương ${chapterNumber}`);
    // setReadingChapter(chapterNumber);
  };

  if (loading) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!comic) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy truyện</h1>
          <Link href="/danh-sach/truyen">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white py-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <Link href="/danh-sach/truyen">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            className="text-white hover:text-gray-300"
          >
            Quay lại
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Title and Genre */}
        <h1 className="text-4xl font-bold mb-2">{comic.comicName}</h1>
        <div className="flex gap-2 mb-6">
          <span className="bg-purple-600 px-3 py-1 rounded-full text-sm">
            {comic.comicGenre}
          </span>
          <span className="bg-gray-700 px-3 py-1 rounded-full text-sm">
            {comic.comicAuthor}
          </span>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <StarFilled /> Rating
            </div>
            <p className="text-2xl font-bold text-yellow-500">4.5/5</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <EyeOutlined /> Lượt xem
            </div>
            <p className="text-2xl font-bold">{comic.views?.toLocaleString() || "0"}</p>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
              <HeartFilled /> Followers
            </div>
            <p className="text-2xl font-bold">{comic.followers?.toLocaleString() || "0"}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Cover Image */}
          <div className="lg:col-span-1 flex justify-center">
            <div className="relative w-full max-w-xs">
              <Image
                src={comic.comicCover}
                alt={comic.comicName}
                width={250}
                height={350}
                className="w-full rounded-lg shadow-2xl object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-3">
            <h3 className="text-xl font-bold mb-4">Thông tin truyện</h3>
            <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-wrap">
              {comic.comicDescription}
            </p>

            <Divider className="bg-gray-700" />

            {/* Rating Section */}
            <div className="mb-6">
              <p className="text-lg font-semibold mb-3">Đánh giá của bạn</p>
              <Rate
                value={userRating}
                onChange={handleRating}
                size="large"
                disabled={!isLoggedIn}
                className="text-yellow-500"
              />
              {!isLoggedIn && (
                <p className="text-gray-400 text-sm mt-2">
                  Đăng nhập để đánh giá truyện này
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 flex-wrap">
              <Button
                type="primary"
                size="large"
                icon={isBookmarked ? <HeartFilled /> : <HeartOutlined />}
                onClick={handleBookmark}
                className={isBookmarked ? "bg-red-600 border-red-600" : ""}
              >
                {isBookmarked ? "Đã theo dõi" : "Theo dõi"}
              </Button>
              <Button
                type="default"
                size="large"
                icon={<BookOutlined />}
                onClick={() => {
                  if (chapters.length > 0) {
                    handleReadChapter(chapters[0].number);
                  }
                }}
              >
                Đọc chương mới nhất
              </Button>
            </div>
          </div>
        </div>

        {/* Chapters Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-4">Danh sách chương ({chapters.length})</h3>
          
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-4">
                {chapters.map((chapter) => (
                  <button
                    key={chapter.id}
                    onClick={() => handleReadChapter(chapter.number)}
                    className="bg-gray-700 hover:bg-purple-600 p-3 rounded text-left transition duration-200"
                  >
                    <div className="font-semibold">{chapter.title}</div>
                    <div className="text-xs text-gray-400">{chapter.date}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!isLoggedIn && (
            <p className="text-gray-400 text-sm mt-4 text-center">
              Đăng nhập để đọc các chương
            </p>
          )}
        </div>

        {/* Related Section */}
        <div className="border-t border-gray-700 pt-8">
          <h3 className="text-2xl font-bold mb-4">Truyện liên quan</h3>
          <div className="text-gray-400">
            Sắp có tính năng này
          </div>
        </div>
      </div>
    </div>
  );
}
