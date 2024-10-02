import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import addMemberSchema from "@/zodSchemas/addMemberSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iAddMemberBody {
  groupId: string;
  newMember: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
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

    const reqBody = await req.json();
    addMemberSchema.parse(reqBody);
    const { groupId, newMember } = reqBody as iAddMemberBody;

    // Check if the group exists
    const existingGroup = await prisma.group.findFirst({
      where: { id: groupId },
    });

    if (!existingGroup) {
      return NextResponse.json(
        {
          message: "Group does not exist",
          success: false,
        },
        { status: 400 }
      );
    }

    // Check if the new member exists
    const memberExists = await prisma.user.findUnique({
      where: { id: newMember },
    });

    if (!memberExists) {
      return NextResponse.json(
        {
          message: "New member does not exist",
          success: false,
        },
        { status: 400 }
      );
    }

    // Add the new member to the group
    const updatedGroup = await prisma.group.update({
      where: { id: existingGroup.id },
      data: {
        members: {
          connect: { id: newMember },
        },
      },
    });

    return NextResponse.json(
      {
        message: "Member added successfully",
        success: true,
        group: updatedGroup,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    console.error("Error adding member to group:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
