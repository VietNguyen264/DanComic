"use client";

import { useState } from "react";
import { Form, Input, Button, message, Checkbox } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useAuth } from "@/context/auth";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const { setIsAdmin } = useAuth();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      console.log("Login attempt:", values);

      // Kiểm tra thông tin Admin duy nhất
      if (values.email === "admin@dancomic.com" && values.password === "admin123") {
        setIsAdmin(true);
        message.success("Đăng nhập Admin thành công!");
        router.push("/admin");
      } else {
        setIsAdmin(false);
        message.success("Đăng nhập thành công!");
        router.push("/");
      }
    } catch (error) {
      message.error("Đăng nhập thất bại!");
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
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email hoặc số điện thoại"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
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
