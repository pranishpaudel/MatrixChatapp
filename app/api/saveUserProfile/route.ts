import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import saveUserProfileSchema from "@/zodSchemas/userProfileSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const reqBody = await req.json();
    saveUserProfileSchema.parse(reqBody);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }

    console.error("Internal Server Error:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
