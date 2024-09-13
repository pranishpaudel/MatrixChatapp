import regex from "@/constants/RegularExpressions";
import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import getUserDataFromPrisma from "@/helpers/prismaUserDetailsProvider";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import searchContactSchema from "@/zodSchemas/searchContactSchema";
import saveUserProfileSchema from "@/zodSchemas/userProfileSchema";
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

    //search all contacts with the given search text if includes in first name or last name
    const dataFromPrisma = await prisma.user.findMany({
      where: {
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
    });
    //extract data firstName, lastName and email only from the dataFromPrisma
    const dataToShow = dataFromPrisma.map((user) => {
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      };
    });
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
