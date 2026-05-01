"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import bookService, { BookType } from "@/services/book/book.service";
import { useAuth } from "@/context/auth";

export default function AdminBookPage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const router = useRouter();
  const { isAdmin, adminEmail, adminPassword } = useAuth();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (!isAdmin) {
      message.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [isAdmin, router]);

  // Load books
  useEffect(() => {
    if (isAdmin) {
      fetchBooks();
    }
  }, [isAdmin]);

  const fetchBooks = async () => {
    setTableLoading(true);
    try {
      const data = await bookService.getAllBooks();
      setBooks(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sách");
    } finally {
      setTableLoading(false);
    }
  };

  // Thêm/Sửa sách
  const handleSubmit = async (values: any) => {
    if (!adminEmail || !adminPassword) {
      message.error("Admin credentials missing");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await bookService.updateBook(editingId, values, adminEmail, adminPassword);
        message.success("Cập nhật sách thành công");
      } else {
        await bookService.addBook(values, adminEmail, adminPassword);
        message.success("Thêm sách thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchBooks();
    } catch (error) {
      message.error("Lỗi khi lưu sách");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Xóa sách
  const handleDelete = async (id: string) => {
    if (!adminEmail || !adminPassword) {
      message.error("Admin credentials missing");
      return;
    }
    Modal.confirm({
      title: "Xóa sách",
      content: "Bạn có chắc chắn muốn xóa sách này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await bookService.deleteBook(id, adminEmail, adminPassword);
          message.success("Xóa sách thành công");
          fetchBooks();
        } catch (error) {
          message.error("Lỗi khi xóa sách");
          console.error(error);
        }
      },
    });
  };

  // Mở modal edit
  const handleEdit = (record: BookType) => {
    setEditingId(record.bookId);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleModalClose = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingId(null);
  };

  const columns = [
    {
      title: "Ảnh bìa",
      dataIndex: "bookCover",
      key: "bookCover",
      width: 80,
      render: (text: string) => (
        <div className="relative w-16 h-24">
          <Image
            src={text}
            alt="Book cover"
            fill
            className="object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/80x120?text=No+Image";
            }}
          />
        </div>
      ),
    },
    {
      title: "Tên sách",
      dataIndex: "bookName",
      key: "bookName",
      width: 200,
    },
    {
      title: "Thể loại",
      dataIndex: "bookGenre",
      key: "bookGenre",
      width: 120,
    },
    {
      title: "Giá",
      dataIndex: "bookPrice",
      key: "bookPrice",
      width: 100,
    },
    {
      title: "Mô tả",
      dataIndex: "bookDescription",
      key: "bookDescription",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (text: string) => (
        <div
          style={{
            maxWidth: 150,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={text}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: BookType) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.bookId)}
          />
        </Space>
      ),
    },
  ];

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quản lý Sách</h1>
              <p className="text-gray-400">Thêm, sửa, xóa thông tin sách trong thư viện</p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={fetchBooks}
                loading={tableLoading}
              >
                Làm Mới
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600"
              >
                Thêm sách mới
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <Table
            dataSource={books}
            columns={columns}
            rowKey="bookId"
            loading={tableLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            style={{ color: "white" }}
          />
        </Card>

        <Modal
          title={editingId ? "Sửa sách" : "Thêm sách mới"}
          open={isModalVisible}
          onCancel={handleModalClose}
          onOk={() => form.submit()}
          confirmLoading={loading}
          okText={editingId ? "Cập nhật" : "Thêm"}
          cancelText="Hủy"
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            className="mt-4"
          >
            <Form.Item
              name="bookName"
              label="Tên sách"
              rules={[
                { required: true, message: "Vui lòng nhập tên sách" },
                { min: 3, message: "Tên sách phải từ 3 ký tự" },
                { max: 100, message: "Tên sách không vượt quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên sách" />
            </Form.Item>

            <Form.Item
              name="bookGenre"
              label="Thể loại"
              rules={[
                { required: true, message: "Vui lòng nhập thể loại" },
                { min: 2, message: "Thể loại phải từ 2 ký tự" },
              ]}
            >
              <Input placeholder="Ví dụ: Kiếm hiệp, Lãng mạn..." />
            </Form.Item>

            <Form.Item
              name="bookPrice"
              label="Giá"
              rules={[
                { required: true, message: "Vui lòng nhập giá" },
                { pattern: /^[0-9]+$/, message: "Giá phải là số" },
                { min: 1, message: "Giá phải lớn hơn 0" },
              ]}
            >
              <Input placeholder="Nhập giá sách" type="number" />
            </Form.Item>

            <Form.Item
              name="bookDescription"
              label="Mô tả"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả" },
                { min: 10, message: "Mô tả phải từ 10 ký tự" },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả chi tiết về sách"
                rows={4}
                maxLength={500}
                style={{
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                }}
              />
            </Form.Item>

            <Form.Item
              name="bookCover"
              label="URL ảnh bìa"
              rules={[{ required: true, message: "Vui lòng nhập URL ảnh bìa" }]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
