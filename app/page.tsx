"use client";

import { useState, useEffect } from "react";
import BookGrid from "@/components/BookGrid";
import { Tabs, Button, Spin } from "antd";
import { useAuth } from "@/context/auth";
import { SettingOutlined } from "@ant-design/icons";
import Link from "next/link";
import bookService from "@/services/book/book.service";
import comicService from "@/services/comic/comic.service";

export default function Home() {
  const [activeTab, setActiveTab] = useState("all");
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksData, comicsData] = await Promise.all([
          bookService.getAllBooks(),
          comicService.getAllComics(),
        ]);
        
        // Map dữ liệu từ API để có field `id` cho BookGrid
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
        }));

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

        setBooks(mappedBooks);
        setComics(mappedComics);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setBooks([]);
        setComics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabItems = [
    {
      key: "all",
      label: "TẤT CẢ",
      children: loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-12">
          {books.length > 0 && <BookGrid books={books} type="sach" title="📚 Sách" />}
          {books.length > 0 && <div className="border-t border-gray-700"></div>}
          {comics.length > 0 && <BookGrid books={comics} type="truyen" title="🔥 Truyện Tranh" />}
          {books.length === 0 && comics.length === 0 && (
            <div className="text-center text-gray-400 py-12">Không có dữ liệu</div>
          )}
        </div>
      ),
    },
    {
      key: "popular",
      label: "TRUYỆN HAY",
      children: loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-12">
          {comics.length > 0 && (
            <BookGrid
              books={[...comics].sort((a, b) => (b.rating || 0) - (a.rating || 0))}
              type="truyen"
              title="⭐ Truyện Hay Nhất"
            />
          )}
          {comics.length === 0 && <div className="text-center text-gray-400 py-12">Không có dữ liệu</div>}
        </div>
      ),
    },
    {
      key: "books",
      label: "SÁCH",
      children: loading ? (
        <div className="flex justify-center py-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-12">
          {books.length > 0 && <BookGrid books={books} type="sach" title="📚 Sách" />}
          {books.length === 0 && <div className="text-center text-gray-400 py-12">Không có dữ liệu</div>}
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
