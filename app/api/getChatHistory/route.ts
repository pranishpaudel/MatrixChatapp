import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import getChatHistorySchema from "@/zodSchemas/getChatHistorySchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iGetChatFriendUidBody {
  chatFriendUid: string;
  numberOfMessages: number;
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
    getChatHistorySchema.parse(reqBody);
    const { chatFriendUid, numberOfMessages } =
      reqBody as iGetChatFriendUidBody;
    const senderId = JWTData.userId as string;

    const chatHistory = await prisma.message.findMany({
      where: {
        senderId,
        recipientId: chatFriendUid,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      take: numberOfMessages,
    });

    return NextResponse.json(
      {
        chatHistory,
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
