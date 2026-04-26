"use client";

import Image from "next/image";
import { Button } from "antd";
import { StarFilled, EyeOutlined, HeartOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

interface BookCardProps {
  id: number;
  bookName: string;
  bookCover: string;
  chapter: number;
  genres: string[];
  description: string;
  rating: number;
  views: number;
  followers: number;
  type: "truyen" | "sach";
}

export default function BookCard({
  id,
  bookName,
  bookCover,
  chapter,
  genres,
  description,
  rating,
  views,
  followers,
  type,
}: BookCardProps) {
  const isDark = type === "truyen";
  const router = useRouter();

  return (
    <div
      className={`flex gap-4 p-4 rounded-lg transition-all duration-300 hover:shadow-xl ${
        isDark ? "bg-gray-800" : "bg-white border border-gray-200"
      }`}
    >
      {/* Cover Image */}
      <div className="flex-shrink-0">
        <Image
          src={bookCover}
          alt={bookName}
          width={120}
          height={160}
          className="rounded-md object-cover shadow-lg"
          priority={false}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Header */}
        <div>
          <p
            className={`text-sm font-semibold ${
              isDark ? "text-gray-400" : "text-gray-600"
            } mb-1`}
          >
            {chapter} Chương
          </p>

          <h3
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {bookName}
          </h3>

          {/* Genres */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {genres.map((genre) => (
              <span
                key={genre}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Description */}
          <p
            className={`text-sm line-clamp-2 mb-3 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {description}
          </p>
        </div>

        {/* Stats & Button */}
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm">
            <span className={isDark ? "text-yellow-400" : "text-yellow-500"}>
              <StarFilled className="mr-1" />
              {rating}
            </span>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
              <EyeOutlined className="mr-1" />
              {views.toLocaleString("vi-VN")}
            </span>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
              <HeartOutlined className="mr-1" />
              {followers.toLocaleString("vi-VN")}
            </span>
          </div>

          <Button
            type="primary"
            danger
            onClick={() => router.push(`/${type}/${id}`)}
            className="w-full font-semibold"
          >
            {type === "truyen" ? "ĐỌC TRUYỆN" : "XEM SẢN PHẨM"}
          </Button>
        </div>
      </div>
    </div>
  );
}
