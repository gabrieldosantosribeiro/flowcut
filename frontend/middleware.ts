import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const TOKEN_COOKIE = "flowcut_token"

export function middleware(request: NextRequest) {
  // Middleware roda no servidor: usa cookie (localStorage não está disponível aqui).
  // O token é sincronizado para o cookie no login via lib/api.ts.
  const token = request.cookies.get(TOKEN_COOKIE)?.value
  const isAuthenticated = Boolean(token)
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
