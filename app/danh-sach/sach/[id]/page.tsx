"use client";

import { useEffect, useState } from "react";
import { Button, Spin, message, Rate, Input } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import bookService, { BookType } from "@/services/book/book.service";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/auth";

export default function BookDetailPage() {
  const params = useParams();
  const bookId = params.id as string;
  const { isLoggedIn } = useAuth();
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(4);

  useEffect(() => {
    const fetchBook = async () => {
      if (!bookId) return;
      setLoading(true);
      try {
        const data = await bookService.getBookById(bookId);
        if (data) {
          setBook(data);
        } else {
          message.error("Không tìm thấy sách");
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        message.error("Lỗi khi tải sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    if (quantity > 0) {
      const cart = JSON.parse(localStorage.getItem("cart") || "{}");
      if (cart[bookId]) {
        cart[bookId].quantity += quantity;
      } else {
        cart[bookId] = {
          bookId: bookId,
          quantity: quantity,
          addedDate: new Date().toISOString(),
        };
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      message.success(`Đã thêm ${quantity} cuốn sách vào giỏ hàng`);
      setQuantity(1);
    }
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy sách</h1>
          <Link href="/danh-sach/sach">
            <Button type="primary" icon={<ArrowLeftOutlined />}>
              Quay lại
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = parseInt(book.bookPrice?.replace(/[^0-9]/g, "") || "0");
  const inStock = true; // có thể thêm field này vào DB sau

  return (
    <div className="bg-white min-h-screen py-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 mb-8">
        <Link href="/danh-sach/sach">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            className="mb-4 text-gray-700 hover:text-gray-900"
          >
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Image */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-xs">
              <Image
                src={book.bookCover}
                alt={book.bookName}
                width={300}
                height={400}
                className="w-full rounded-lg shadow-lg object-cover"
              />
              <div className="mt-4 text-center">
                <span className="inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                  {book.bookGenre}
                </span>
              </div>
            </div>
          </div>

          {/* Book Details */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.bookName}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <Rate value={rating} onChange={setRating} allowHalf />
                <span className="ml-2 text-gray-600">({rating.toFixed(1)}/5 sao)</span>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Giá bán</p>
                  <p className="text-3xl font-bold text-red-600">
                    {price.toLocaleString()} ₫
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm mb-1">Tình trạng</p>
                  <p className="text-xl font-semibold">
                    <span className={inStock ? "text-green-600" : "text-red-600"}>
                      {inStock ? "✓ Còn hàng" : "Hết hàng"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6">
              <p className="text-gray-700 font-medium mb-2">Số lượng:</p>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-gray-700"
                >
                  −
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center"
                />
                <Button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-gray-700"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                type="primary"
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1"
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="large"
                className="flex-1"
                disabled={!inStock}
              >
                Mua ngay
              </Button>
            </div>

            {/* Book Description */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Mô tả sản phẩm</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {book.bookDescription}
              </p>
            </div>

            {/* Additional Info */}
            <div className="border-t border-gray-200 mt-6 pt-6 grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Thể loại</p>
                <p className="font-semibold text-gray-900">{book.bookGenre}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Ngày cập nhật</p>
                <p className="font-semibold text-gray-900">
                  {new Date(book.updatedAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
