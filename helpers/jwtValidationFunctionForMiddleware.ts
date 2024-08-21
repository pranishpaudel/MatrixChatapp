import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import jwtVerifiedUser from "@/types/jwtTypes";

const jwtValidationFunction = async function (token: string): Promise<boolean> {
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

export default jwtValidationFunction;
