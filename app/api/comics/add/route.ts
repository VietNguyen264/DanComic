import { NextRequest, NextResponse } from 'next/server';

interface AddComicRequest {
  comicName?: string;
  comicCover?: string;
  comicDescription?: string;
  comicAuthor?: string;
  comicGenre?: string;
  chapter?: string;
  email?: string;
  password?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: AddComicRequest = await request.json();
    const { email, password, ...comicData } = body;

    // Validate admin credentials
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Validate comic data
    if (!comicData.comicName?.trim() || !comicData.comicGenre?.trim()) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call MockAPI directly
    const mockApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://69d6fefd9c5ebb0918c6e261.mockapi.io';
    const response = await fetch(`${mockApiUrl}/comic`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comicData),
    });

    if (!response.ok) {
      throw new Error('MockAPI error');
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to add comic' },
      { status: 500 }
    );
  }
}
