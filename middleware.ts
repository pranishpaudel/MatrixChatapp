import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import jwtVerifiedUser from "./types/jwtTypes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";
  const REDIRECTION_FOR_UNAUTHENTICATED = `${request.nextUrl.origin}/auth`;

  // Bypass the middleware for the /auth path
  if (pathname === "/auth") {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(REDIRECTION_FOR_UNAUTHENTICATED);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const verifiedJWT = payload as unknown as jwtVerifiedUser;

    if (!verifiedJWT.email) {
      return NextResponse.redirect(REDIRECTION_FOR_UNAUTHENTICATED);
    }
  } catch (error) {
    // Clear the JWT cookie if it is invalid or expired
    const response = NextResponse.redirect(REDIRECTION_FOR_UNAUTHENTICATED);
    response.cookies.set("token", "", { maxAge: -1, path: "/" });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile", "/auth"],
};
