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
    if (!email || !password) {
      return NextResponse.json(
        { success: false, isAdmin: false, message: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Get admin credentials from environment
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Check admin credentials
    if (email === adminEmail && password === adminPassword) {
      return NextResponse.json(
        { success: true, isAdmin: true, message: 'Đăng nhập Admin thành công!' },
        { status: 200 }
      );
    }

    // For now, allow any non-admin login
    // In production, validate against your user database
    if (email.includes('@')) {
      return NextResponse.json(
        { success: true, isAdmin: false, message: 'Đăng nhập thành công!' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, isAdmin: false, message: 'Email hoặc mật khẩu không chính xác' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, isAdmin: false, message: 'Đăng nhập thất bại' },
      { status: 500 }
    );
  }
}
