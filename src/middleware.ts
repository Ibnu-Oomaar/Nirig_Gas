import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = token.role as string;

    // Role-based route protection
    if (pathname.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/cashier") && role !== "CASHIER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/seller") && role !== "SELLER") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // API route protection
    if (pathname.startsWith("/api/users") && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (pathname.startsWith("/api/expenses") && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (pathname.startsWith("/api/reports") && role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/cashier/:path*",
    "/seller/:path*",
    "/api/users/:path*",
    "/api/expenses/:path*",
    "/api/reports/:path*",
    "/api/stock-movements/:path*",
    "/api/dashboard/:path*",
  ],
};
