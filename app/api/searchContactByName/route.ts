import regex from "@/constants/RegularExpressions";
import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import getUserDataFromPrisma from "@/helpers/prismaUserDetailsProvider";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import searchContactSchema from "@/zodSchemas/searchContactSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iSeachContactBody {
  searchText: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const JWTData = await isJWTValidForApi(req);
    const reqBody = await req.json();
    searchContactSchema.parse(reqBody);
    const { searchText } = reqBody as iSeachContactBody;

    if (!JWTData.success) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    const userId = JWTData.userId as string; // Extract userId from the JWT

    // Fetch user's existing friends
    const existingFriends = await prisma.friend.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
      select: {
        friendId: true,
        userId: true,
      },
    });

    // Extract IDs of existing friends
    const friendIds = existingFriends.map((friend) =>
      friend.userId === userId ? friend.friendId : friend.userId
    );

    // Fetch users from Prisma excluding existing friends
    const dataFromPrisma = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId, // Exclude own user data
              notIn: friendIds, // Exclude already added friends
            },
          },
          {
            OR: [
              {
                firstName: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: searchText,
                  mode: "insensitive",
                },
              },
            ],
          },
        ],
      },
    });

    // Extract firstName, lastName, email, and image from the result
    const dataToShow = dataFromPrisma.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      image: user.image,
    }));

    return NextResponse.json(
      {
        message: "User Data",
        success: true,
        data: dataToShow,
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
