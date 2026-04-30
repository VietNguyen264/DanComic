import { NextRequest, NextResponse } from 'next/server';

interface AddBookRequest {
  bookName?: string;
  bookCover?: string;
  bookDescription?: string;
  bookPrice?: string;
  bookGenre?: string;
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AddBookRequest = await request.json();
    const { email, password, ...bookData } = body;

    // Validate admin credentials
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Validate book data
    if (!bookData.bookName?.trim() || !bookData.bookPrice?.trim() || !bookData.bookGenre?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call MockAPI directly
    const mockApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://69d6fefd9c5ebb0918c6e261.mockapi.io';
    const response = await fetch(`${mockApiUrl}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      throw new Error('MockAPI error');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to add book' },
      { status: 500 }
    );
  }
}
