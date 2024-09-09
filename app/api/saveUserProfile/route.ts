import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import saveUserProfileSchema from "@/zodSchemas/userProfileSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
interface iProfileSaveBody {
  firstName: string;
  lastName: string;
  email: string;
  profileImageBase64: string;
}
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const JWTData = await isJWTValidForApi(req);

    const reqBody = await req.json();
    saveUserProfileSchema.parse(reqBody);
    const { firstName, lastName, email, profileImageBase64 } =
      reqBody as iProfileSaveBody;

    if (!JWTData.success || JWTData.email !== email) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }
    // Check if the user already exists
    const checkExisitingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!checkExisitingUser) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false,
        },
        { status: 404 }
      );
    }
    // Save the user profile
    await prisma.user.update({
      where: { email },
      data: {
        firstName,
        lastName,
        image: profileImageBase64,
        isProfileSetup: true,
      },
    });

    return NextResponse.json(
      {
        message: "Profile Saved Successfully",
        success: true,
      },
      { status: 200 }
    );
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
