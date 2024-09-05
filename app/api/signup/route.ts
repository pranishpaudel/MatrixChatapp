import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import { createS3FolderInBucket } from "@/utils/awsReusableFunctions/awsCommandsProvider";
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

    // Check if the user already exists
    const checkExisitingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (checkExisitingUser) {
      return NextResponse.json({
        message: "User already exists",
        success: false,
      });
    }

    // Create the new user in the database
    const user = await prisma.user.create({
      data: { email, password },
    });

    if (user) {
      // Attempt to create an S3 folder for the user
      try {
        await createS3FolderInBucket(`${user.id as string}`);

        // Update user with awsProfileCreated = true
        await prisma.user.update({
          where: { id: user.id },
          data: { awsProfileCreated: true },
        });

        return NextResponse.json({
          message: "User registered and AWS folder created successfully",
          success: true,
        });
      } catch (awsError) {
        console.error("Error creating AWS folder:", awsError);

        // If the folder creation fails, update user with awsProfileCreated = false
        await prisma.user.update({
          where: { id: user.id },
          data: { awsProfileCreated: false },
        });

        return NextResponse.json({
          message: "User registered, but AWS folder creation failed",
          success: true,
        });
      }
    }

    return NextResponse.json({
      message: "User not registered",
      success: false,
    });
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
