import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const PUBLIC_API_ROUTES = ["/api/login", "/api/register"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const method = request.method;

  console.log(`Middleware intercepted: ${method} ${pathname}`);

  // required for cross origin
  if (method === "OPTIONS") {
    console.log(`Handling OPTIONS request for ${pathname}`);
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
    console.log(`Public route allowed: ${pathname}`);
    return NextResponse.next();
  }


  if (pathname.startsWith("/api")) {
    const authHeader = request.headers.get("authorization");
    console.log(`Authorization header for ${pathname}: ${authHeader}`);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log(`Missing or invalid Authorization header for ${pathname}`);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // validating the jwt token

    const token = authHeader.replace("Bearer ", "");
    console.log("Token After Separation: " + token);

    try {
      console.log("Inside the Token Check Mechanism");
      console.log("JWT_SECRET:", process.env.JWT_SECRET);

      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      console.log("Payload:", payload);

      // Attach payload to request headers for API route
      const response = NextResponse.next();
      response.headers.set("x-user-id", String(payload.id));
      response.headers.set("x-user-email", String(payload.email));
      response.headers.set("x-user-first-name", String(payload.first_name));
      response.headers.set("x-user-last-name", String(payload.last_name));

      console.log("Before The Return of Token Validation Mechanism");
      return response;
    } catch (error: any) {
      console.error("Token verification error:", error.name, error.message);
      return NextResponse.json({ error: `Invalid or expired token: ${error.message}` }, { status: 401 });
    }
  }

  console.log(`Proceeding to next middleware for ${pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};