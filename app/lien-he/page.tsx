"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";

export default function LienHePage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      message.success("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất.");
      form.resetFields();
    } catch (error) {
      message.error("Gửi thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-lg text-green-100">
            Có câu hỏi hoặc ý kiến? Vấn đề của bạn với trang web sẽ giúp chúng tôi hoàn thiện hơn.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn</h2>

            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              className="space-y-4"
            >
              <Form.Item
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên của bạn" }]}
              >
                <Input
                  placeholder="Họ và tên"
                  size="large"
                  className="bg-gray-50"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  size="large"
                  className="bg-gray-50"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Số điện thoại"
                  size="large"
                  className="bg-gray-50"
                />
              </Form.Item>

              <Form.Item
                name="subject"
                rules={[{ required: true, message: "Vui lòng nhập chủ đề" }]}
              >
                <Input
                  placeholder="Chủ đề"
                  size="large"
                  className="bg-gray-50"
                />
              </Form.Item>

              <Form.Item
                name="message"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung tin nhắn" },
                  { min: 10, message: "Tin nhắn phải có ít nhất 10 ký tự" },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Nội dung tin nhắn..."
                  className="bg-gray-50"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  block
                  className="bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700"
                >
                  Gửi Tin Nhắn
                </Button>
              </Form.Item>
            </Form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông Tin Liên Hệ</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600">contact@dancomic.com</p>
                <p className="text-gray-600">support@dancomic.com</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Điện Thoại</h3>
                <p className="text-gray-600">+84 (0) 123 456 789</p>
                <p className="text-gray-600">+84 (0) 987 654 321</p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Địa Chỉ</h3>
                <p className="text-gray-600">
                  123 Đường Nguyễn Huệ
                  <br />
                  Quận 1, TP. Hồ Chí Minh
                  <br />
                  Việt Nam
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Giờ Làm Việc</h3>
                <p className="text-gray-600">
                  Thứ 2 - Thứ 6: 09:00 - 18:00
                  <br />
                  Thứ 7: 09:00 - 12:00
                  <br />
                  Chủ nhật: Đóng cửa
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
