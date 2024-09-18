import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import prisma from "@/prisma/prisma.config";
import { NextResponse, NextRequest } from "next/server";

// Define the structure of JWTData
interface JWTData {
  success: boolean;
  userId?: string;
}

// Define the structure of a group member
interface GroupMember {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  image: string | null;
}

// Define the structure of a group including members
interface GroupWithMembers {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const JWTData: any = await isJWTValidForApi(req);
    if (!JWTData.success || !JWTData.userId) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }

    const userId = JWTData.userId;

    // Fetch groups where the user is a member
    const groups: GroupWithMembers[] = (await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        members: true,
      },
    })) as GroupWithMembers[];

    // Format the response
    const groupList = groups.map((group: GroupWithMembers) => ({
      groupName: group.name,
      groupId: group.id,
      members: group.members.map((member: GroupMember) => ({
        id: member.id,
        firstName: member.firstName,
        lastName: member.lastName,
      })),
    }));

    return NextResponse.json(
      {
        message: "Group list fetched successfully",
        success: true,
        groups: groupList,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching group list:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        success: false,
      },
      { status: 500 }
    );
  }
}
