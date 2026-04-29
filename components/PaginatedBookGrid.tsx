"use client";

import { useState } from "react";
import BookCard from "./BookCard";

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
    bookPrice?: string | number;
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
  const totalPages = Math.ceil(books.length / itemsPerPage);
  const hasMore = currentPage < totalPages - 1;

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
                      ? "bg-red-600 text-white"
                      : isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
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
                className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                →
              </button>
            )}
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
