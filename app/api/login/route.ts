import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import loginSchema from "@/zodSchemas/loginSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import jwt from "jsonwebtoken";

interface iLoginBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    loginSchema.parse(reqBody);
    const { email, password } = reqBody as iLoginBody;

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
    const checkUserLogin = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!checkUserLogin) {
      return NextResponse.json({
        message: `Invalid password`,
        success: false,
      });
    }

    const isProfileSetup = checkUserLogin?.isProfileSetup;
    const tokenData = {
      id: checkUserLogin.id,
      email: checkUserLogin.email,
      isProfileSetup,
    };
    const token = jwt.sign(tokenData, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({
      message: "User logged in",
      success: true,
    });
    response.cookies.set("token", token, {
      httpOnly: true,
    });
    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
