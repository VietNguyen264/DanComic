"use client";

import { useState } from "react";
import { Form, Input, Button, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Save user info to localStorage for now (until real database is ready)
      const userData = {
        username: values.username,
        email: values.email,
        phone: values.phone,
        fullname: values.fullname,
      };
      localStorage.setItem(`user_${values.email}`, JSON.stringify(userData));
      
      message.success("Đăng ký thành công! Đang chuyển hướng...");
      // Redirect to login page after 1.5 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error) {
      message.error("Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">DanComic</h1>
        <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">Đăng Ký</h2>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="fullname"
            rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Họ và tên"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
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
              className="bg-gray-700 border-gray-600 text-white"
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
              className="bg-gray-700 border-gray-600 text-white"
            />
          </Form.Item>

          <Form.Item
            name="username"
            rules={[{ required: true, message: "Vui lòng nhập biệt danh" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Biệt danh"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Mật khẩu không khớp"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
              className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
            >
              Đăng Ký
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <p className="text-gray-400">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-red-600 hover:text-red-500">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
