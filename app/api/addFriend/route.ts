import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import addFriendSchema from "@/zodSchemas/addFriendSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iSeachContactBody {
  friendId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const JWTData = await isJWTValidForApi(req);
    const reqBody = await req.json();
    addFriendSchema.parse(reqBody);
    const { friendId } = reqBody as iSeachContactBody;

    if (!JWTData.success) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    const userId = JWTData.userId as string;

    // Check if userId and friendId are the same
    if (userId === friendId) {
      return NextResponse.json(
        {
          message: "You cannot add yourself as a friend",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if the friend relationship already exists
    const existingFriendship = await prisma.friend.findFirst({
      where: {
        userId,
        friendId,
      },
    });

    if (existingFriendship) {
      return NextResponse.json(
        {
          message: "Friendship already exists",
          success: false,
        },
        { status: 400 }
      );
    }

    const friend = await prisma.friend.create({
      data: {
        userId, // the ID of the user who is making the friend connection
        friendId, // the ID of the friend user
      },
    });

    return NextResponse.json(
      {
        message: "Friend added successfully",
        success: true,
      },
      { status: 200 }
    );
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
