"use client";

import bookService, { BookType, CreateBookType } from "@/services/book/book.service";
import { useState, useEffect } from "react";

// Antd
import { Table, Image, Modal, Input, Button, message } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

export default function BookList() {
  // Điền thông tin họ tên, mã số sinh viên
  const thongTinSV = {
    fullName: "Nguyễn Quốc Việt",
    studentId: "124000901",
  };

  const columns = [
    { title: "Book ID", dataIndex: "bookId", key: "bookId" },
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
    },
    {
      title: "Ảnh bìa",
      dataIndex: "bookCover",
      key: "bookCover",
      // PHẦN ĐIỂM CỘNG: Hiển thị hình ảnh thay vì link text
      render: (url: string) => (
        <Image
          src={url}
          alt="Book Cover"
          width={60}
          height={80}
          className="object-cover rounded shadow-sm"
          fallback="https://via.placeholder.com/60x80?text=No+Image"
        />
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "bookDescription",
      key: "bookDescription",
      ellipsis: true,
    },
    {
      title: "Giá",
      dataIndex: "bookPrice",
      key: "bookPrice",
      render: (price: string) => `${Number(price).toLocaleString()} VNĐ`,
    },
    {
      title: "Thể loại",
      dataIndex: "bookGenre",
      key: "bookGenre",
    },
    {
      title: "Chức năng",
      key: "actions",
      width: 200,
      render: (item: BookType) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            ghost
            icon={<EditOutlined />}
            onClick={() => openUpdateModal(item)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => openDeleteModal(item)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // state dữ liệu book
  const [bookData, setBookData] = useState<BookType[]>([]);

  // state modal
  const [modalUpdate, setModalUpdate] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  // state giá trị form cho inputs
  const [bookName, setBookName] = useState("");
  const [bookCover, setBookCover] = useState("");
  const [bookDescription, setBookDescription] = useState("");
  const [bookPrice, setBookPrice] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [selectedBookId, setSelectedBookId] = useState("");

  // reset form
  const resetForm = () => {
    setSelectedBookId("");
    setBookName("");
    setBookCover("");
    setBookDescription("");
    setBookPrice("");
    setBookGenre("");
  };

  // Hàm lấy dữ liệu book và gán vô bookData
  const fetchBookData = async () => {
    try {
      const data = await bookService.getAllBooks();
      setBookData(data);
    } catch (error) {
      message.error("Không thể lấy dữ liệu từ API!");
    }
  };

  // Chạy hàm lấy dữ liệu khi load trang web
  useEffect(() => {
    fetchBookData();
  }, []);

  // Mở modal Thêm/Sửa
  const openUpdateModal = (book: BookType | null) => {
    if (book) {
      // Nếu có book truyền vào -> Chế độ Sửa
      setSelectedBookId(book.bookId);
      setBookName(book.bookName);
      setBookCover(book.bookCover);
      setBookDescription(book.bookDescription);
      setBookPrice(book.bookPrice);
      setBookGenre(book.bookGenre);
    } else {
      // Nếu book là null -> Chế độ Thêm mới
      resetForm();
    }
    setModalUpdate(true);
  };

  // Đóng modal Thêm/Sửa
  const closeUpdateModal = () => {
    setModalUpdate(false);
    resetForm();
  }

  // Mở modal Xóa
  const openDeleteModal = (book: BookType) => {
    setSelectedBookId(book.bookId);
    setDeleteModal(true);
  };

  // Đóng modal Xóa
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedBookId("");
  }
  
  // Thêm+sửa dữ liệu
  const handleSave = async () => {
    const payload: CreateBookType = {
      bookName,
      bookCover,
      bookDescription,
      bookPrice,
      bookGenre,
    };

    try {
      if (selectedBookId) {
        //Cập nhật thông tin sách
        await bookService.updateBook(selectedBookId, payload);
        message.success("Cập nhật sách thành công!");
      } else {
        //Thêm sách mới
        await bookService.addBook(payload);
        message.success("Thêm sách mới thành công!");
      }
      fetchBookData(); //Load lại bảng
      closeUpdateModal();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu dữ liệu!");
    }
  };

  // Xóa data sách
  const handleDelete = async () => {
    try {
      if (selectedBookId) {
        await bookService.deleteBook(selectedBookId);
        message.success("Xóa sách thành công!");
        fetchBookData();
        closeDeleteModal();
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-3">
      {/* Thông tin sinh viên */}
      <div className="bg-white border rounded-lg p-6 mb-6 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold mb-2">THI GIỮA KỲ - Đợt 2</h2>
          <div className="flex gap-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm border border-blue-100">
              Họ tên: {thongTinSV.fullName || "Nguyễn Quốc Việt"}
            </span>
            <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-sm border border-purple-100">
              MSSV: {thongTinSV.studentId || "124000901"}
            </span>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          icon={<PlusOutlined />}
          onClick={() => openUpdateModal(null)}
          className="rounded-md"
        >
          Thêm sách mới
        </Button>
      </div>

      {/* Bảng antd */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <Table
          dataSource={bookData}
          columns={columns}
          rowKey="bookId"
          pagination={{ pageSize: 5 }}
        />
      </div>

      {/* Modal Thêm/Sửa */}
      <Modal
        title={selectedBookId ? "Cập nhật sách" : "Thêm sách mới"}
        open={modalUpdate}
        onCancel={closeUpdateModal}
        onOk={handleSave}
        okText="Lưu dữ liệu"
        cancelText="Hủy"
        centered
      >
        <hr className="my-4" />
        <div className="space-y-4">
          <div>
            <label className="block font-bold mb-1">Tên sách</label>
            <Input 
              size="large" 
              placeholder="Nhập tên sách..." 
              value={bookName}
              onChange={(e) => setBookName(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Link ảnh bìa</label>
            <Input 
              size="large" 
              placeholder="URL hình ảnh..." 
              value={bookCover}
              onChange={(e) => setBookCover(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Thể loại</label>
            <Input 
              size="large" 
              placeholder="Ví dụ: Trinh thám,..." 
              value={bookGenre}
              onChange={(e) => setBookGenre(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Mô tả</label>
            <Input.TextArea 
              rows={3} 
              placeholder="Nhập mô tả sách..." 
              value={bookDescription}
              onChange={(e) => setBookDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block font-bold mb-1">Giá bán</label>
            <Input 
              size="large" 
              placeholder="Ví dụ: 150000" 
              type="number" 
              value={bookPrice}
              onChange={(e) => setBookPrice(e.target.value)}
            />
          </div>
        </div>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        open={deleteModal}
        onCancel={closeDeleteModal}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true }}
        cancelText="Hủy"
        centered
      >
        <div className="text-center p-4 text-red-500">
          <ExclamationCircleOutlined className="text-5xl mb-4" />
          <h3 className="text-xl font-bold">Xác nhận xóa</h3>
          <p className="text-gray-700">
            Quyển sách này sẽ bị xóa khỏi hệ thống. Hành động này không thể hoàn tác.
          </p>
        </div>
      </Modal>
    </div>
  );
}