import regex from "@/constants/RegularExpressions";
import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import getUserDataFromPrisma from "@/helpers/prismaUserDetailsProvider";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import getGroupMembersSchema from "@/zodSchemas/getGroupMembersSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iGetUserBody {
  groupId: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const JWTData = await isJWTValidForApi(req);
    const reqBody = await req.json();
    getGroupMembersSchema.parse(reqBody); // Validate the request body
    const { groupId } = reqBody as iGetUserBody;

    if (!JWTData.success) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    // Get Group Members with groupId
    const dataFromPrisma = await prisma.group.findUnique({
      where: {
        id: groupId,
      },
      include: {
        members: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
          },
        },
      },
    });

    if (!dataFromPrisma) {
      return NextResponse.json(
        {
          message: "Group not found",
          success: false,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User Data",
        success: true,
        data: dataFromPrisma,
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
