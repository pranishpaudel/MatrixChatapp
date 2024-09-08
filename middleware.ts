import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwtValidationFunction from "./helpers/jwtValidationFunctionForMiddleware";
import regex from "./constants/RegularExpressions";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";
  const REDIRECTION_FOR_UNAUTHENTICATED = `${request.nextUrl.origin}/auth`;

  const jwtDetails = await jwtValidationFunction(token);
  const isJwtValid = jwtDetails.success;

  if (pathname === "/profile" && isJwtValid) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/profile/${jwtDetails.email}`
    );
  } else if (
    pathname.startsWith("/profile") &&
    !regex.profilePathRegex.test(pathname) &&
    isJwtValid
  ) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/profile/${jwtDetails.email}`
    );
  } else if (
    regex.profilePathRegex.test(pathname) &&
    isJwtValid &&
    pathname !== `/profile/${jwtDetails.email}`
  ) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/profile/${jwtDetails.email}`
    );
  }
  if (pathname === "/auth" && isJwtValid) {
    return NextResponse.redirect(`${request.nextUrl.origin}/profile`);
  }
  // Bypass the middleware for the /auth path
  if (pathname === "/auth") {
    return NextResponse.next();
  }

  if (!token || !isJwtValid) {
    return NextResponse.redirect(REDIRECTION_FOR_UNAUTHENTICATED);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/profile/:path*"],
};
