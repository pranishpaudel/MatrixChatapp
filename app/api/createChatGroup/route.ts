import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import chatGroupSchema from "@/zodSchemas/createChatGroupSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iCreateGroupBody {
  groupName: string;
  groupMembers: string[]; // Made optional
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
    chatGroupSchema.parse(reqBody);
    const { groupName, groupMembers } = reqBody as iCreateGroupBody;

    // Debugging: Log the groupMembers array
    console.log("groupMembers:", groupMembers);

    // Check if the group name already exists
    const existingGroup = await prisma.group.findFirst({
      where: { name: groupName },
    });

    if (existingGroup) {
      return NextResponse.json(
        {
          message: "Group name already exists",
          success: false,
        },
        { status: 400 }
      );
    }

    // Ensure all group members exist
    const membersExist = await prisma.user.findMany({
      where: {
        id: {
          in: groupMembers,
        },
      },
    });

    if (membersExist.length !== groupMembers.length) {
      return NextResponse.json(
        {
          message: "One or more group members do not exist",
          success: false,
        },
        { status: 400 }
      );
    }

    // Create the group
    const newGroup = await prisma.group.create({
      data: {
        name: groupName,
        members: {
          connect: groupMembers.map((memberId) => ({ id: memberId })),
        },
      },
    });

    return NextResponse.json(
      {
        message: "Group created successfully",
        success: true,
        group: newGroup,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleZodError(error);
    }
    console.error("Error creating group:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
