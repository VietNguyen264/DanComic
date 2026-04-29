"use client";

import { useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth";

interface LoginValues {
  email: string;
  password: string;
  remember?: boolean;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { setIsAdmin } = useAuth();

  const onFinish = async (values: LoginValues) => {
    setLoading(true);
    try {
      // Call secure API endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsAdmin(data.isAdmin);
        message.success(data.message);
        // Redirect based on role
        router.push(data.isAdmin ? '/admin' : '/');
      } else {
        message.error(data.message || 'Đăng nhập thất bại!');
        form.resetFields(['password']);
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Lỗi kết nối. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">DanComic</h1>
        <h2 className="text-xl font-semibold text-gray-300 mb-6 text-center">Đăng Nhập</h2>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email hoặc số điện thoại" },
              {
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email hoặc số điện thoại"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 4, message: "Mật khẩu phải ít nhất 4 ký tự" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked" initialValue={false}>
            <Checkbox className="text-gray-300">Nhớ tôi</Checkbox>
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
              Đăng Nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center space-y-2">
          <p className="text-gray-400">
            Bạn chưa có tài khoản?{" "}
            <Link href="/auth/register" className="text-red-600 hover:text-red-500">
              Đăng ký ngay
            </Link>
          </p>
          <p>
            <Link href="/auth/forgot-password" className="text-red-600 hover:text-red-500 text-sm">
              Quên mật khẩu?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
