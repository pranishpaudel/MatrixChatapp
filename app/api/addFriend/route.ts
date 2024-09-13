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

    const friend = await prisma.friend.create({
      data: {
        userId, // the ID of the user who is making the friend connection
        friendId, // the ID of the friend user
      },
    });
    console.log(friend);

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
