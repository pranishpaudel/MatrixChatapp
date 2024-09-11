import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import prisma from "@/prisma/prisma.config";
export async function POST(req: NextRequest, res: NextResponse) {
  const JWTData = await isJWTValidForApi(req);

  const reqBody = await req.json();
  const { email } = reqBody;

  if (!JWTData.success || JWTData.email !== email) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false,
      },
      { status: 401 }
    );
  }

  const checkExisitingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (!checkExisitingUser) {
    return NextResponse.json({
      message: "User does not exist",
      success: false,
    });
  }
  const tokenData = {
    id: checkExisitingUser?.id,
    email,
    isProfileSetup: checkExisitingUser.isProfileSetup,
  };
  //resign the token
  const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
  const response = NextResponse.json({
    message: "JWT TOKEN UPDATED",
    success: true,
  });
  response.cookies.set("token", token, {
    httpOnly: true,
  });
  return response;
}
