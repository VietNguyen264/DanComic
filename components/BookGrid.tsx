"use client";

import BookCard from "./BookCard";

interface BookGridProps {
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
}

export default function BookGrid({ books, type, title }: BookGridProps) {
  const isDark = type === "truyen";

  return (
    <div
      className={`py-8 ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
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
          {books.map((book) => (
            <BookCard
              key={book.id}
              {...book}
              type={type}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
