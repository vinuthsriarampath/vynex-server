// middleware.ts
import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  // Set CORS headers
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173'); // Match your frontend dev server
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include common headers
  res.headers.set('Access-Control-Allow-Credentials', 'true'); // If using cookies or credentials

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log("Middleware is running for OPTIONS");
    return new Response(null, { status: 204, headers: res.headers });
  }

  return res;
}

// Apply middleware to all API routes under /api
export const config = {
  matcher: '/api/:path*',
};