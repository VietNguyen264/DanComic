import { NextRequest, NextResponse } from 'next/server';

interface DeleteComicRequest {
  id: string;
  email?: string;
  password?: string;
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const body: DeleteComicRequest = await request.json();
    const { id, email, password } = body;

    // Validate admin credentials
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    if (!id?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Comic ID is required' },
        { status: 400 }
      );
    }

    // Call MockAPI directly
    const mockApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://69d6fefd9c5ebb0918c6e261.mockapi.io';
    const response = await fetch(`${mockApiUrl}/comic/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('MockAPI error');
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to delete comic' },
      { status: 500 }
    );
  }
}
