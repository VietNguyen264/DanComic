"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Dropdown, Badge } from "antd";
import { UserOutlined, MenuOutlined, CloseOutlined, LogoutOutlined, DashboardOutlined, ShoppingCartOutlined, BookOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, isLoggedIn, userName, logout } = useAuth();

  // Get bookmarks count from localStorage
  const [bookmarksCount] = useState(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "{}");
      return Object.keys(bookmarks).length;
    }
    return 0;
  });

  const danh_sachMenuItems = [
    {
      key: "sach",
      label: <Link href="/danh-sach/sach">Sách</Link>,
    },
    {
      key: "truyen",
      label: <Link href="/danh-sach/truyen">Truyện Online</Link>,
    },
  ];

  const userMenuItems = isAdmin
    ? [
        {
          key: "admin",
          icon: <DashboardOutlined />,
          label: <Link href="/admin">Dashboard Admin</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <span onClick={logout}>Đăng xuất</span>,
        },
      ]
    : isLoggedIn && userName
    ? [
        {
          key: "cart",
          icon: <ShoppingCartOutlined />,
          label: <Link href="/">Giỏ hàng</Link>,
        },
        {
          key: "bookmarks",
          icon: <BookOutlined />,
          label: <Link href="/">Truyện đã theo dõi ({bookmarksCount})</Link>,
        },
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: <span onClick={logout}>Đăng xuất</span>,
        },
      ]
    : [
        {
          key: "login",
          icon: <UserOutlined />,
          label: <Link href="/auth/login">Đăng nhập</Link>,
        },
      ];

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-red-600">
            DanComic
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="hover:text-red-600 transition-colors"
            >
              Trang chủ
            </Link>

            <Dropdown menu={{ items: danh_sachMenuItems }}>
              <a
                onClick={(e) => e.preventDefault()}
                className="hover:text-red-600 transition-colors cursor-pointer"
              >
                Danh sách
              </a>
            </Dropdown>

            <Link
              href="/lien-he"
              className="hover:text-red-600 transition-colors"
            >
              Liên hệ
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-yellow-500 text-sm font-semibold hover:text-yellow-400 transition-colors"
              >
                 ADMIN
              </Link>
            )}

            <Dropdown menu={{ items: userMenuItems }}>
              <a
                onClick={(e) => e.preventDefault()}
                className="flex items-center gap-2 hover:text-red-600 transition-colors cursor-pointer"
              >
                <UserOutlined />
                {isLoggedIn && userName ? userName : isAdmin ? "Tài khoản" : "Đăng nhập"}
              </a>
            </Dropdown>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block hover:text-red-600 transition-colors py-2"
            >
              Trang chủ
            </Link>
            <Link
              href="/danh-sach/sach"
              className="block hover:text-red-600 transition-colors py-2"
            >
              Sách
            </Link>
            <Link
              href="/danh-sach/truyen"
              className="block hover:text-red-600 transition-colors py-2"
            >
              Truyện Online
            </Link>
            <Link
              href="/lien-he"
              className="block hover:text-red-600 transition-colors py-2"
            >
              Liên hệ
            </Link>
            
            {isAdmin && (
              <>
                <Link
                  href="/admin"
                  className="block hover:text-yellow-400 transition-colors py-2 font-semibold"
                >
                   Dashboard Admin
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left hover:text-red-600 transition-colors py-2"
                >
                  Đăng xuất
                </button>
              </>
            )}
            
            {isLoggedIn && userName && (
              <>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <p className="text-gray-400 text-sm py-2">Tài khoản: {userName}</p>
                  <Link
                    href="/"
                    className="block hover:text-red-600 transition-colors py-2"
                  >
                    Giỏ hàng
                  </Link>
                  <Link
                    href="/"
                    className="block hover:text-red-600 transition-colors py-2"
                  >
                    Truyện đã theo dõi ({bookmarksCount})
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left hover:text-red-600 transition-colors py-2"
                  >
                    Đăng xuất
                  </button>
                </div>
              </>
            )}
            
            {!isAdmin && !isLoggedIn && (
              <Link
                href="/auth/login"
                className="block hover:text-red-600 transition-colors py-2"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
