"use client";

import { useState } from "react";
import BookCard from "./BookCard";
import { Button } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";

interface PaginatedBookGridProps {
  books: Array<{
    id: number;
    bookName: string;
    bookCover: string;
    chapter: number;
    genres: string[];
    description: string;
    rating: number;
    views: number;
    followers: number;
  }>;
  type: "truyen" | "sach";
  title?: string;
  itemsPerPage?: number;
}

export default function PaginatedBookGrid({
  books,
  type,
  title,
  itemsPerPage = 4,
}: PaginatedBookGridProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const isDark = type === "truyen";

  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);
  const hasMore = endIndex < books.length;

  const handleViewMore = () => {
    setCurrentPage(currentPage + 1);
    // Scroll to top of this section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`py-8 ${isDark ? "bg-gray-900" : "bg-white"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <h2
            className={`text-2xl font-bold mb-6 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentBooks.map((book) => (
            <BookCard key={book.id} {...book} type={type} />
          ))}
        </div>

        {/* View More Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={handleViewMore}
              className="bg-red-600 border-none hover:bg-red-700"
            >
              Xem Thêm
            </Button>
          </div>
        )}

        {/* Pagination Info */}
        {books.length > 0 && (
          <div className={`text-center mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Hiển thị {startIndex + 1} - {Math.min(endIndex, books.length)} trong {books.length}
          </div>
        )}
      </div>
    </div>
  );
}
