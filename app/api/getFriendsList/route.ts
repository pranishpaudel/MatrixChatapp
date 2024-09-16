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

    // Search firstName, lastName, email, and image of the friends of user
    const friendsList1 = await prisma.friend.findMany({
      where: {
        userId: JWTData.userId as string,
      },
      select: {
        friend: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    const friendsList2 = await prisma.friend.findMany({
      where: {
        friendId: JWTData.userId as string,
      },
      select: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            image: true,
          },
        },
      },
    });

    // Combine the results from both queries
    const combinedFriendsList = [
      ...friendsList1.map((friend) => friend.friend),
      ...friendsList2.map((friend) => friend.user),
    ];

    return NextResponse.json(
      {
        message: "Friends List",
        success: true,
        data: combinedFriendsList,
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
