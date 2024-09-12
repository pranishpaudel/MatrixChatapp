// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwtValidationFunction from "./helpers/jwtValidationFunctionForMiddleware";
import { handleProfileRoutes } from "./helpers/middlewareHelpers";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";
  const REDIRECTION_FOR_UNAUTHENTICATED = `${request.nextUrl.origin}/auth`;

  const jwtDetails = await jwtValidationFunction(token);
  const isJwtValid = jwtDetails.success;
  // Bypass the middleware for the /auth path
  if (pathname === "/auth" && isJwtValid) {
    return NextResponse.redirect(`${request.nextUrl.origin}`);
  } else if (pathname === "/auth") {
    return NextResponse.next();
  }

  if (!token || !isJwtValid) {
    return NextResponse.redirect(REDIRECTION_FOR_UNAUTHENTICATED);
  }
  if (pathname.startsWith("/profile")) {
    const profileResponse = await handleProfileRoutes(
      request,
      jwtDetails as any
    );
    if (profileResponse !== NextResponse.next()) {
      return profileResponse;
    }
  } else if (!pathname.startsWith("/profile") && !jwtDetails.isProfileSetup) {
    return NextResponse.redirect(
      `${request.nextUrl.origin}/profile/${jwtDetails.email}`
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth", "/chat", "/profile/:path*"],
};
