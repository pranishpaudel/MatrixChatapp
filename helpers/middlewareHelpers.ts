// profileMiddleware.ts

import regex from "@/constants/RegularExpressions";
import { NextRequest, NextResponse } from "next/server";

export async function handleProfileRoutes(
  request: NextRequest,
  jwtDetails: {
    success: boolean;
    email: string | undefined;
    isProfileSetup: boolean;
  }
) {
  const { pathname } = request.nextUrl;
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

  return NextResponse.next();
}
