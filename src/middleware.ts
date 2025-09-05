import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const PUBLIC_API_ROUTES = ["/api/login", "/api/register","/api/open"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  // required for cross-origin
  if (method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // allow public api's here
  if (PUBLIC_API_ROUTES.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }


  if (pathname.startsWith("/api")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // validating the jwt token

    const token = authHeader.replace("Bearer ", "");

    try {

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);

      // Attach payload to request headers for the API route
      const response = NextResponse.next();
      response.headers.set("x-user-id", String(payload.id));
      response.headers.set("x-user-email", String(payload.email));
      response.headers.set("x-user-first-name", String(payload.first_name));
      response.headers.set("x-user-last-name", String(payload.last_name));

      return response;
    } catch (error: any) {
      return NextResponse.json({ error: `Invalid or expired token: ${error.message}` }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};