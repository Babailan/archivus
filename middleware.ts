import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  request.headers.append("pathname", request.nextUrl.pathname);
  return NextResponse.next({ headers: request.headers });
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/subjects/:path*",
};

