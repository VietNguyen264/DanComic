"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import comicService, { ComicType } from "@/services/comic/comic.service";
import { useAuth } from "@/context/auth";

export default function AdminComicPage() {
  const [comics, setComics] = useState<ComicType[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const router = useRouter();
  const { isAdmin, isLoaded, adminEmail, adminPassword } = useAuth();

  // Kiểm tra quyền admin
  useEffect(() => {
    if (isLoaded && !isAdmin) {
      message.error("Bạn không có quyền truy cập trang này");
      router.push("/");
    }
  }, [isAdmin, isLoaded, router]);

  // Load comics
  useEffect(() => {
    if (isAdmin) {
      fetchComics();
    }
  }, [isAdmin]);

  const fetchComics = async () => {
    setTableLoading(true);
    try {
      const data = await comicService.getAllComics();
      setComics(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách truyện tranh");
    } finally {
      setTableLoading(false);
    }
  };

  // Thêm/Sửa truyện tranh
  const handleSubmit = async (values: any) => {
    if (!adminEmail || !adminPassword) {
      message.error("Admin credentials missing");
      return;
    }
    setLoading(true);
    try {
      if (editingId) {
        await comicService.updateComic(editingId, values, adminEmail, adminPassword);
        message.success("Cập nhật truyện tranh thành công");
      } else {
        await comicService.addComic(values, adminEmail, adminPassword);
        message.success("Thêm truyện tranh thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchComics();
    } catch (error: any) {
      message.error(`Lỗi khi lưu truyện tranh: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Xóa truyện tranh
  const handleDelete = async (id: string) => {
    if (!adminEmail || !adminPassword) {
      message.error("Admin credentials missing");
      return;
    }
    Modal.confirm({
      title: "Xóa truyện tranh",
      content: "Bạn có chắc chắn muốn xóa truyện tranh này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await comicService.deleteComic(id, adminEmail, adminPassword);
          message.success("Xóa truyện tranh thành công");
          fetchComics();
        } catch (error) {
          message.error("Lỗi khi xóa truyện tranh");
          console.error(error);
        }
      },
    });
  };

  // Mở modal edit
  const handleEdit = (record: ComicType) => {
    setEditingId(record.id);
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
      dataIndex: "comicCover",
      key: "comicCover",
      width: 80,
      render: (text: string) => (
        <div className="relative w-16 h-24">
          <Image
            src={text}
            alt="Comic cover"
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
      title: "Tên truyện tranh",
      dataIndex: "comicName",
      key: "comicName",
      width: 200,
    },
    {
      title: "Tác giả",
      dataIndex: "comicAuthor",
      key: "comicAuthor",
      width: 120,
    },
    {
      title: "Thể loại",
      dataIndex: "comicGenre",
      key: "comicGenre",
      width: 120,
    },
    {
      title: "Mô tả",
      dataIndex: "comicDescription",
      key: "comicDescription",
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
      title: "Số chương",
      dataIndex: "chapter",
      key: "chapter",
      width: 100,
    },
    {
      title: "Hành động",
      key: "action",
      width: 120,
      render: (_: any, record: ComicType) => (
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
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  if (!isLoaded || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Quản lý Truyện Tranh</h1>
              <p className="text-gray-400">Thêm, sửa, xóa thông tin truyện tranh trong thư viện</p>
            </div>
            <div className="flex gap-3">
              <Button
                icon={<ReloadOutlined />}
                size="large"
                onClick={fetchComics}
                loading={tableLoading}
              >
                Làm Mới
              </Button>
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="bg-green-600 hover:bg-green-700 border-green-600"
              >
                Thêm truyện tranh mới
              </Button>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <Table
            dataSource={comics}
            columns={columns}
            rowKey="id"
            loading={tableLoading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: true }}
            style={{ color: "white" }}
          />
        </Card>

        <Modal
          title={editingId ? "Sửa truyện tranh" : "Thêm truyện tranh mới"}
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
              name="comicName"
              label="Tên truyện tranh"
              rules={[
                { required: true, message: "Vui lòng nhập tên truyện tranh" },
                { min: 3, message: "Tên truyện tranh phải từ 3 ký tự" },
                { max: 100, message: "Tên truyện tranh không vượt quá 100 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên truyện tranh" />
            </Form.Item>

            <Form.Item
              name="comicAuthor"
              label="Tác giả"
              rules={[
                { required: true, message: "Vui lòng nhập tên tác giả" },
                { min: 2, message: "Tên tác giả phải từ 2 ký tự" },
              ]}
            >
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>

            <Form.Item
              name="comicGenre"
              label="Thể loại"
              rules={[
                { required: true, message: "Vui lòng nhập thể loại" },
                { min: 2, message: "Thể loại phải từ 2 ký tự" },
              ]}
            >
              <Input placeholder="Ví dụ: Kiếm hiệp, Lãng mạn, Hành động..." />
            </Form.Item>

            <Form.Item
              name="chapter"
              label="Số chương"
              rules={[
                { required: true, message: "Vui lòng nhập số chương" },
                { pattern: /^[0-9]+$/, message: "Số chương phải là số dương" },
              ]}
            >
              <Input type="number" placeholder="Nhập số chương hiện có" min="1" />
            </Form.Item>

            <Form.Item
              name="comicDescription"
              label="Mô tả"
              rules={[
                { required: true, message: "Vui lòng nhập mô tả" },
                { min: 10, message: "Mô tả phải từ 10 ký tự" },
              ]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả chi tiết về truyện tranh"
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
              name="comicCover"
              label="URL ảnh bìa"
              rules={[
                { required: true, message: "Vui lòng nhập URL ảnh bìa" },
                { 
                  pattern: /^https?:\/\/.+/, 
                  message: "URL phải bắt đầu bằng http:// hoặc https://" 
                },
              ]}
            >
              <Input placeholder="https://example.com/image.jpg" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}
