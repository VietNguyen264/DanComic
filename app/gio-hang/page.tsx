"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button, Empty, Spin, Table, message, Popconfirm, InputNumber, Row, Col } from "antd";
import { ArrowLeftOutlined, DeleteOutlined, ShoppingOutlined } from "@ant-design/icons";
import ScrollToTop from "@/components/ScrollToTop";
import bookService, { BookType } from "@/services/book/book.service";
import { useAuth } from "@/context/auth";
import { useRouter } from "next/navigation";

interface CartItem {
  bookId: string;
  quantity: number;
  addedDate: string;
}

export default function GioHangPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartBooksWithDetails, setCartBooksWithDetails] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart items
  useEffect(() => {
    if (!isLoggedIn) {
      message.warning("Vui lòng đăng nhập để xem giỏ hàng");
      router.push("/auth/login");
      return;
    }

    const loadCart = async () => {
      try {
        setLoading(true);

        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem("cart") || "{}") as Record<string, CartItem>;

        if (Object.keys(cart).length === 0) {
          setCartItems([]);
          setCartBooksWithDetails([]);
          setLoading(false);
          return;
        }

        // Fetch all books from API
        const allBooks = await bookService.getAllBooks();

        // Map cart items with book details
        const cartItemsArray = Object.values(cart);
        const mapped = cartItemsArray
          .map((cartItem) => {
            const book = (allBooks || []).find(
              (b: any) => (b.bookId || b.id) === cartItem.bookId
            );
            if (!book) return null;

            return {
              bookId: cartItem.bookId,
              bookName: book.bookName,
              bookCover: book.bookCover,
              bookPrice: book.bookPrice,
              quantity: cartItem.quantity,
              addedDate: cartItem.addedDate,
              genres: book.bookGenre ? [book.bookGenre] : [],
            };
          })
          .filter(Boolean)
          .sort((a: any, b: any) => 
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );

        setCartItems(cartItemsArray);
        setCartBooksWithDetails(mapped);
      } catch (error) {
        console.error("Failed to load cart:", error);
        message.error("Lỗi khi tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isLoggedIn, router]);

  const handleRemoveItem = (bookId: string) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    delete cart[bookId];
    localStorage.setItem("cart", JSON.stringify(cart));
    setCartBooksWithDetails(cartBooksWithDetails.filter((item) => item.bookId !== bookId));
    message.success("Đã xóa khỏi giỏ hàng");
  };

  const handleQuantityChange = (bookId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(bookId);
      return;
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "{}");
    if (cart[bookId]) {
      cart[bookId].quantity = newQuantity;
      localStorage.setItem("cart", JSON.stringify(cart));
      setCartBooksWithDetails(
        cartBooksWithDetails.map((item) =>
          item.bookId === bookId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculatePrice = (price: string | number, quantity: number) => {
    const priceNum = typeof price === "string" 
      ? parseInt(price.replace(/[^0-9]/g, "")) 
      : price;
    return priceNum * quantity;
  };

  const totalPrice = cartBooksWithDetails.reduce((sum, item) => {
    return sum + calculatePrice(item.bookPrice, item.quantity);
  }, 0);

  const handleCheckout = () => {
    message.success("Tiếp tục đến thanh toán");
    // TODO: Implement checkout
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (cartBooksWithDetails.length === 0) {
    return (
      <div className="bg-white min-h-screen">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/danh-sach/sach">
                <Button type="primary" icon={<ArrowLeftOutlined />}>
                  Quay lại
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl font-bold mb-2">Giỏ Hàng</h1>
            <p className="text-lg text-blue-100">
              Quản lý các sách bạn muốn mua
            </p>
          </div>
        </div>

        {/* Empty State */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Empty
            description="Giỏ hàng của bạn trống"
            className="text-gray-700"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link href="/danh-sach/sach">
              <Button type="primary">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/danh-sach/sach">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Quay lại
              </Button>
            </Link>
          </div>
          <h1 className="text-4xl font-bold mb-2">Giỏ Hàng</h1>
          <p className="text-lg text-blue-100">
            {cartBooksWithDetails.length} sản phẩm trong giỏ hàng
          </p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={24}>
          {/* Cart Items */}
          <Col xs={24} lg={16}>
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Sản phẩm</h2>
              <div className="space-y-4">
                {cartBooksWithDetails.map((item) => (
                  <div
                    key={item.bookId}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex gap-4 items-center justify-between"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.bookName}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.genres.join(", ")}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-red-600">
                          {typeof item.bookPrice === "string"
                            ? item.bookPrice
                            : `${item.bookPrice.toLocaleString("vi-VN")} ₫`}
                        </p>
                      </div>

                      <InputNumber
                        min={1}
                        value={item.quantity}
                        onChange={(val) =>
                          handleQuantityChange(item.bookId, val || 1)
                        }
                        style={{ width: "70px" }}
                      />

                      <div className="text-right min-w-[120px]">
                        <p className="text-sm text-gray-600">Tổng cộng</p>
                        <p className="text-lg font-bold text-red-600">
                          {calculatePrice(item.bookPrice, item.quantity).toLocaleString(
                            "vi-VN"
                          )}{" "}
                          ₫
                        </p>
                      </div>

                      <Popconfirm
                        title="Xóa khỏi giỏ hàng"
                        description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                        onConfirm={() => handleRemoveItem(item.bookId)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <Button danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Order Summary */}
          <Col xs={24} lg={8}>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20 h-fit">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{totalPrice.toLocaleString("vi-VN")} ₫</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế:</span>
                  <span>Tính khi thanh toán</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Tổng cộng:</span>
                <span className="text-red-600">{totalPrice.toLocaleString("vi-VN")} ₫</span>
              </div>

              <Button
                type="primary"
                size="large"
                danger
                block
                icon={<ShoppingOutlined />}
                onClick={handleCheckout}
              >
                Thanh toán
              </Button>

              <Link href="/danh-sach/sach" className="block mt-3">
                <Button size="large" block>
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>
          </Col>
        </Row>
      </div>

      <ScrollToTop />
    </div>
  );
}
