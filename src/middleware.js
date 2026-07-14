import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Protect dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return redirectToLogin(request, pathname);
    }

    // Verify token
    try {
      jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      // Invalid token – clear it and redirect to login
      const response = redirectToLogin(request, pathname);
      response.cookies.delete("token");
      return response;
    }

    // Valid token – allow access
    return NextResponse.next();
  }

  // If already logged in with a valid token, redirect away from login page
  if (pathname === "/admin/login") {
    if (!token) {
      // No token – show login page
      return NextResponse.next();
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET);
      // Valid token – redirect to dashboard
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } catch (error) {
      // Invalid token – clear it and show login page
      const response = NextResponse.next();
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request, fromPath) {
  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("from", fromPath);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/admin/login"],
};