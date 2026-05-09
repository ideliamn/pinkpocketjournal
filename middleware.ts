import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("sb-access-token");

  const isAuthPage =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register");

  // BELUM LOGIN
  if (!token && !isAuthPage) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // SUDAH LOGIN TAPI MASIH KE LOGIN PAGE
  if (token && isAuthPage) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/expenses/:path*",
    "/bills/:path*",
    "/plans/:path*",
    "/categories/:path*",
    "/sources/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};