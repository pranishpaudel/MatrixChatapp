import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import jwtVerifiedUser from "@/types/jwtTypes";
import localEnv from "@/env.localExport";

interface JwtValidationResult {
  success: boolean;
  userId?: string;
  email?: string;
  isProfileSetup?: boolean;
}

const jwtValidationFunction = async function (
  token: string
): Promise<JwtValidationResult> {
  try {
    const secret = new TextEncoder().encode(localEnv.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const verifiedJWT = payload as unknown as jwtVerifiedUser;

    if (!verifiedJWT.email || !verifiedJWT.id) {
      return { success: false };
    }

    return {
      success: true,
      userId: verifiedJWT.id,
      email: verifiedJWT.email,
      isProfileSetup: verifiedJWT.isProfileSetup,
    };
  } catch (error) {
    // Clear the JWT cookie if it is invalid or expired
    const response = NextResponse.next();
    response.cookies.set("token", "", { maxAge: -1, path: "/" });
    return { success: false };
  }
};

export default jwtValidationFunction;
