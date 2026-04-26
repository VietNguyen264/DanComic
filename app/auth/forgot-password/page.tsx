"use client";

import { useState } from "react";
import { Form, Input, Button, message, Steps } from "antd";
import Link from "next/link";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");

  const handleStep1 = async (values: any) => {
    setLoading(true);
    try {
      // Simulate sending verification code
      console.log("Sending code to:", values.email);
      message.success("ĐÃ GỬI XÁC NHẬN VỀ MAIL");
      setEmail(values.email);
      setStep(1);
    } catch (error) {
      message.error("Gửi xác nhận thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (values: any) => {
    setLoading(true);
    try {
      // Simulate password reset
      console.log("Reset password for:", email);
      message.success("Mật khẩu đã được cập nhật thành công!");
      setStep(2);
    } catch (error) {
      message.error("Cập nhật mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Xác nhận Email",
      content: "Nhập email của bạn",
    },
    {
      title: "Đặt lại Mật khẩu",
      content: "Nhập mật khẩu mới",
    },
    {
      title: "Hoàn tất",
      content: "Mật khẩu đã được cập nhật",
    },
  ];

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">DanComic</h1>
        <h2 className="text-xl font-semibold text-white mb-6 text-center">Quên Mật Khẩu</h2>

        <Steps 
          current={step} 
          items={steps.map(s => ({
            title: s.title,
            content: s.content,
          }))} 
          className="mb-8 custom-steps" 
        />

        {step === 0 && (
          <Form form={form} onFinish={handleStep1} layout="vertical" className="space-y-4">
            <p className="text-white mb-4 font-medium">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu:
            </p>

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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              >
                Gửi Xác Nhận
              </Button>
            </Form.Item>
          </Form>
        )}

        {step === 1 && (
          <Form
            form={form}
            onFinish={handleStep2}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu mới"
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
                Cập Nhật Mật Khẩu
              </Button>
            </Form.Item>
          </Form>
        )}

        {step === 2 && (
          <div className="text-center space-y-4">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="text-white text-lg">Mật khẩu của bạn đã được cập nhật thành công!</p>
            <Link href="/auth/login">
              <Button
                type="primary"
                size="large"
                block
                className="bg-red-600 hover:bg-red-700 border-red-600 hover:border-red-700"
              >
                Quay lại Đăng Nhập
              </Button>
            </Link>
          </div>
        )}

        {step === 0 && (
          <div className="text-center mt-4">
            <p className="text-gray-300">
              Quay lại{" "}
              <Link href="/auth/login" className="text-red-600 hover:text-red-500">
                Đăng nhập
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
