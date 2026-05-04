import { NextRequest, NextResponse } from 'next/server';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  isAdmin: boolean;
  message: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body: LoginRequest = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, isAdmin: false, message: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Get admin credentials from environment
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check admin credentials (strict)
    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        { success: true, isAdmin: true, message: 'Đăng nhập Admin thành công!' },
        { status: 200 }
      );
    }

    // Allow regular users to login with any email/password (not admin credentials)
    // This enables user registration feature
    return NextResponse.json(
      { success: true, isAdmin: false, message: 'Đăng nhập thành công!' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, isAdmin: false, message: 'Đăng nhập thất bại' },
      { status: 500 }
    );
  }
}
