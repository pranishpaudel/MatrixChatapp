import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import prisma from "@/prisma/prisma.config";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const JWTData = await isJWTValidForApi(req);
    if (!JWTData.success) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }
    //search firstName,lastName, email and image of the friends of user
    const friendsList = await prisma.friend.findMany({
      where: {
        userId: JWTData.userId as string,
      },
      select: {
        friend: {
          select: {
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    // Extract friend details from the result
    const friends = friendsList.map((friend) => friend.friend);

    return NextResponse.json(
      {
        message: "Friends List",
        success: true,
        data: friends,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
