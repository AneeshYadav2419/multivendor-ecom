import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session state from custom cookie
  const token = request.cookies.get("auramarket-session")?.value;
  
  let userRole: string | null = null;
  if (token) {
    try {
      const payloadBase64 = token.split(".")[1];
      // Decode base64 URL format safely
      const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payloadDecoded = JSON.parse(jsonPayload);
      userRole = payloadDecoded.role;
    } catch (e) {
      // Invalid token format
    }
  }

  // Protect Admin Routes
  if (pathname.startsWith("/admin")) {
    if (!token || userRole !== "ADMIN") {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  // Protect Vendor Routes
  if (pathname.startsWith("/vendor")) {
    if (!token || userRole !== "VENDOR") {
      return NextResponse.redirect(new URL(`/login?redirect=${encodeURIComponent(pathname)}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/vendor/:path*"],
};
