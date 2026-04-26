"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, Row, Col, Button, Statistic, message } from "antd";
import {
  BookOutlined,
  FileTextOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/context/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const { isAdmin, logout, isLoaded } = useAuth();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      message.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [isAdmin, isLoaded, router]);

  if (!isLoaded || !isAdmin) {
    return null;
  }

  const handleLogout = () => {
    logout();
    message.success("Đăng xuất thành công!");
    router.push("/");
  };

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">👑 Admin Dashboard</h1>
            <p className="text-gray-400">Quản lý sách, truyện và nội dung DanComic</p>
          </div>
          <Button
            danger
            icon={<LogoutOutlined />}
            size="large"
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>

        {/* Stats Grid */}
        <Row gutter={[16, 16]} className="mb-8">
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300">Tổng Sách</span>}
                value={124}
                prefix={<BookOutlined className="text-blue-500" />}
                styles={{ content: { color: "#3b82f6" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300">Tổng Truyện</span>}
                value={87}
                prefix={<FileTextOutlined className="text-green-500" />}
                styles={{ content: { color: "#10b981" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300">Người Dùng</span>}
                value={3542}
                prefix={<UserOutlined className="text-purple-500" />}
                styles={{ content: { color: "#a855f7" } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card className="bg-gray-800 border-gray-700">
              <Statistic
                title={<span className="text-gray-300">Lượt Truy Cập</span>}
                value={45890}
                prefix={<BarChartOutlined className="text-red-500" />}
                styles={{ content: { color: "#ef4444" } }}
              />
            </Card>
          </Col>
        </Row>

        {/* Management Cards */}
        <Row gutter={[16, 16]}>
          {/* Quản lý Sách */}
          <Col xs={24} lg={12}>
            <Card
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow h-full"
              title={
                <span className="text-white flex items-center gap-2">
                  <BookOutlined />
                  Quản Lý Sách
                </span>
              }
            >
              <p className="text-gray-400 mb-6">
                Thêm, sửa, xóa thông tin các cuốn sách trong thư viện
              </p>
              <Link href="/admin/sach">
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 border-blue-600"
                >
                  Quản Lý Sách
                </Button>
              </Link>
            </Card>
          </Col>

          {/* Quản lý Truyện Tranh */}
          <Col xs={24} lg={12}>
            <Card
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition-shadow h-full"
              title={
                <span className="text-white flex items-center gap-2">
                  <FileTextOutlined />
                  Quản Lý Truyện Tranh
                </span>
              }
            >
              <p className="text-gray-400 mb-6">
                Thêm, sửa, xóa thông tin các tác phẩm truyện tranh online
              </p>
              <Link href="/admin/truyen">
                <Button
                  type="primary"
                  size="large"
                  className="w-full bg-green-600 hover:bg-green-700 border-green-600"
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
