"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Button, Statistic, message } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/auth";
import bookService from "@/services/book/book.service";
import comicService from "@/services/comic/comic.service";

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, logout, isLoaded } = useAuth();
  const [bookCount, setBookCount] = useState(0);
  const [comicCount, setComicCount] = useState(0);

  // Kiểm tra quyền admin
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      message.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [isAdmin, isLoaded, router]);

  // Fetch statistics từ API
  const fetchStats = async () => {
    try {
      const [booksData, comicsData] = await Promise.all([
        bookService.getAllBooks(),
        comicService.getAllComics(),
      ]);
      setBookCount((booksData || []).length);
      setComicCount((comicsData || []).length);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Load stats on mount only (no auto-refresh polling)
  useEffect(() => {
    if (isAdmin) {
      fetchStats();
    }
  }, [isAdmin]);

  if (!isLoaded || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-gray-900 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-400">Quản lý sách, truyện và nội dung DanComic</p>
        </div>

        {/* Stats Grid */}
        <Row gutter={[12, 12]} className="mb-8">
          <Col xs={12} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300 text-xs sm:text-sm">Tổng Sách</span>}
                value={bookCount}
                prefix={<BookOutlined className="text-blue-500" />}
                styles={{ content: { color: "#3b82f6", fontSize: '1.5rem' } }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300 text-xs sm:text-sm">Tổng Truyện</span>}
                value={comicCount}
                prefix={<FileTextOutlined className="text-green-500" />}
                styles={{ content: { color: "#10b981", fontSize: '1.5rem' } }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300 text-xs sm:text-sm">Người Dùng</span>}
                value={3542}
                prefix={<UserOutlined className="text-purple-500" />}
                styles={{ content: { color: "#a855f7", fontSize: '1.5rem' } }}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300 text-xs sm:text-sm">Lượt Truy Cập</span>}
                value={45890}
                prefix={<BarChartOutlined className="text-red-500" />}
                styles={{ content: { color: "#ef4444", fontSize: '1.5rem' } }}
              />
            </Card>
          </Col>
        </Row>

        {/* Management Cards */}
        <Row gutter={[12, 12]}>
          {/* Quản lý Sách */}
          <Col xs={24} md={12}>
            <Card
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow h-full"
              title={
                <span className="text-white flex items-center gap-2 text-sm sm:text-base">
                  <BookOutlined />
                  Quản Lý Sách
                </span>
              }
            >
              <p className="text-xs sm:text-sm text-gray-400 mb-6">
                Tùy chỉnh thông tin loại sách
              </p>
              <Link href="/admin/sach">
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600 text-sm sm:text-base"
                >
                  Quản Lý Sách
                </Button>
              </Link>
            </Card>
          </Col>

          {/* Quản lý Truyện Tranh */}
          <Col xs={24} md={12}>
            <Card
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow h-full"
              title={
                <span className="text-white flex items-center gap-2 text-sm sm:text-base">
                  <FileTextOutlined />
                  Quản Lý Truyện Tranh
                </span>
              }
            >
              <p className="text-xs sm:text-sm text-gray-400 mb-6">
                Tùy chỉnh thông tin truyện tranh online
              </p>
              <Link href="/admin/truyen">
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-green-600 hover:bg-green-700 border-green-600 text-sm sm:text-base"
                >
                  Quản Lý Truyện Tranh
                </Button>
              </Link>
            </Card>
          </Col>
        </Row>

        {/* Back Button */}
        <div className="mt-8">
          <Link href="/">
            <Button className="text-gray-300 border-gray-600 hover:text-white">
              ← Quay lại Trang Chủ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
