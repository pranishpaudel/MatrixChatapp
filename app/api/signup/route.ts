import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import signupSchema from "@/zodSchemas/signupSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iSignupBody {
  email: string;
  password: string;
  confirmPassword: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    signupSchema.parse(reqBody);
    const { email, password, confirmPassword } = reqBody as iSignupBody;
    if (password !== confirmPassword) {
      return NextResponse.json({
        message: "Passwords do not match",
        success: false,
      });
    }
    const checkExisitingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (checkExisitingUser) {
      return NextResponse.json({
        message: "User already exists",
        success: false,
      });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
    if (user) {
      return NextResponse.json({
        message: `User Registered ${email}`,
        success: true,
      });
    }
    return NextResponse.json({
      message: "User not registered",
      success: false,
    });
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
