import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import jwtVerifiedUser from "./types/jwtTypes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value || "";
  const REDIRECTION_FOR_UNAUTHENTICATED = `${request.nextUrl.origin}/auth`;

  const jwtValidationFunction = async function (
    token: string
  ): Promise<boolean> {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      const verifiedJWT = payload as unknown as jwtVerifiedUser;

      if (!verifiedJWT.email || !verifiedJWT.id) {
        return false;
      }
      return true;
    } catch (error) {
      // Clear the JWT cookie if it is invalid or expired
      const response = NextResponse.next();
      response.cookies.set("token", "", { maxAge: -1, path: "/" });
      return false;
    }
  };

  const isJwtValid = await jwtValidationFunction(token);
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
  matcher: ["/", "/profile", "/auth"],
};
