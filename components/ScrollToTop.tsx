"use client";

import { useEffect, useState } from "react";
import { FloatButton } from "antd";
import { ArrowUpOutlined } from "@ant-design/icons";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button khi scroll > 300px
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!visible) return null;

  return (
    <FloatButton
      icon={<ArrowUpOutlined />}
      type="primary"
      onClick={scrollToTop}
      className="bg-blue-600 hover:bg-blue-700"
      tooltip="Quay lại đầu trang"
    />
  );
}
