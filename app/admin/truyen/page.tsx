"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Space, message, Card } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
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
  const { isAdmin, isLoaded } = useAuth();

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
    setLoading(true);
    try {
      console.log("Submitting comic data:", values);
      if (editingId) {
        await comicService.updateComic(editingId, values);
        message.success("Cập nhật truyện tranh thành công");
      } else {
        await comicService.addComic(values);
        message.success("Thêm truyện tranh thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchComics();
    } catch (error: any) {
      console.error("Comic submission error:", error.response?.status, error.response?.data || error.message);
      message.error(`Lỗi khi lưu truyện tranh: ${error.response?.status || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Xóa truyện tranh
  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: "Xóa truyện tranh",
      content: "Bạn có chắc chắn muốn xóa truyện tranh này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await comicService.deleteComic(id);
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
      title: "Tên truyện tranh",
      dataIndex: "comicName", // Kiểm tra xem MockAPI của bạn trả về 'comicName' hay 'bookName'
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
      width: 200,
      ellipsis: true,
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
              rules={[{ required: true, message: "Vui lòng nhập tên truyện tranh" }]}
            >
              <Input placeholder="Nhập tên truyện tranh" />
            </Form.Item>

            <Form.Item
              name="comicAuthor"
              label="Tác giả"
              rules={[{ required: true, message: "Vui lòng nhập tên tác giả" }]}
            >
              <Input placeholder="Nhập tên tác giả" />
            </Form.Item>

            <Form.Item
              name="comicGenre"
              label="Thể loại"
              rules={[{ required: true, message: "Vui lòng nhập thể loại" }]}
            >
              <Input placeholder="Ví dụ: Kiếm hiệp, Lãng mạn, Hành động..." />
            </Form.Item>

            <Form.Item
              name="comicDescription"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea
                placeholder="Nhập mô tả chi tiết về truyện tranh"
                rows={4}
              />
            </Form.Item>

            <Form.Item
              name="comicCover"
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
