import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const PUBLIC_API_ROUTES = ["/api/login", "/api/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("Intercepted:", pathname);

  // Allow public routes
  if (PUBLIC_API_ROUTES.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const token = authHeader.split(" ")[1];
      const payload = verify(token, process.env.NEXTAUTH_URL!);

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user", JSON.stringify(payload));

      return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

// ✅ Required: matcher config
export const config = {
  matcher: ["/api/:path*"],
};
