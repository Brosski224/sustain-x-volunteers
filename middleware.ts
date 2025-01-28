import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")

  // Paths that don't require authentication
  if (
    request.nextUrl.pathname.startsWith("/api/auth") ||
    request.nextUrl.pathname === "/" ||
    request.nextUrl.pathname === "/register"
  ) {
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  try {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    await jwtVerify(token.value, secret)
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL("/", request.url))
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
}

