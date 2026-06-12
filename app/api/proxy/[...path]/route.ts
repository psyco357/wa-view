import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API Handler
 * - Validasi authentication token
 * - Forward request ke backend API
 * - Hanya user yang login yang bisa akses
 */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const token = getTokenFromRequest(request);

    // Validasi token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // Konstruksi URL backend
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || '';
    const pathString = path.join('/');
    const queryString = request.nextUrl.search;
    const fullUrl = `${baseApi}/${pathString}${queryString}`;

    // Forward request ke backend dengan token
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy GET error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const token = getTokenFromRequest(request);

    // Validasi token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // Baca body request
    let body: any = null;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    } else if (contentType?.includes('multipart/form-data')) {
      body = await request.formData();
    }

    // Konstruksi URL backend
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || '';
    const pathString = path.join('/');
    const queryString = request.nextUrl.search;
    const fullUrl = `${baseApi}/${pathString}${queryString}`;

    // Prepare headers
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
      Accept: 'application/json',
    };

    // Set Content-Type only if not FormData
    if (!(body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Forward request ke backend dengan token
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers,
      body: body instanceof FormData ? body : JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy POST error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const token = getTokenFromRequest(request);

    // Validasi token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // Baca body request
    let body: any = null;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    }

    // Konstruksi URL backend
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || '';
    const pathString = path.join('/');
    const queryString = request.nextUrl.search;
    const fullUrl = `${baseApi}/${pathString}${queryString}`;

    // Forward request ke backend dengan token
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy PUT error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const token = getTokenFromRequest(request);

    // Validasi token
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Token tidak ditemukan' },
        { status: 401 }
      );
    }

    // Baca body request jika ada
    let body: any = null;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      body = await request.json();
    }

    // Konstruksi URL backend
    const baseApi = process.env.NEXT_PUBLIC_BASE_API || '';
    const pathString = path.join('/');
    const queryString = request.nextUrl.search;
    const fullUrl = `${baseApi}/${pathString}${queryString}`;

    // Forward request ke backend dengan token
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy DELETE error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function untuk ambil token dari request
 * Cek dari header Authorization atau cookie
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Cek dari header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7); // Hapus 'Bearer ' prefix
  }

  // Cek dari cookie
  const token = request.cookies.get('authToken')?.value;
  if (token) {
    return token;
  }

  // Cek dari header custom
  const customToken = request.headers.get('x-auth-token');
  if (customToken) {
    return customToken;
  }

  return null;
}
