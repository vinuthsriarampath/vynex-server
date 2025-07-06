// middleware.ts (root of Next.js project)
import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log("Middleware triggered for:", req.url, "Method:", req.method); // Debug log
  const res = NextResponse.next();

  // Set CORS headers
  res.headers.set('Access-Control-Allow-Origin', 'http://localhost:5173'); // Must match frontend origin
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Include common headers
  res.headers.set('Access-Control-Allow-Credentials', 'true'); // If using credentials
  res.headers.set('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS request for:", req.url);
    return new Response(null, { status: 204, headers: res.headers });
  }

  return res;
}

// Apply middleware to all API routes under /api
export const config = {
  matcher: '/api/:path*', // Ensure this matches your API routes
};