import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': cookieHeader,
      },
    });

    const data = await response.json();
    const setCookie = response.headers.get('set-cookie');

    const headers: HeadersInit = {};
    if (setCookie) {
      headers['set-cookie'] = setCookie;
    }

    return NextResponse.json(data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
