import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import getChatHistorySchema from "@/zodSchemas/getChatHistorySchema";

import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";

interface iGetChatFriendUidBody {
  chatFriendUid: string;
  numberOfMessages?: number; // Made optional
  isGroup?: boolean; // Made optional
}

interface Chat {
  id: string;
  sender: "user" | "other";
  message: string;
  timestamp: string;
  senderId?: string; // Optional field for group chats
  senderFirstName?: string; // Optional field for group chats
  senderLastName?: string; // Optional field for group chats
  senderImage?: string; // Optional field for group chats
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
    const { chatFriendUid, numberOfMessages, isGroup } =
      reqBody as iGetChatFriendUidBody;
    const userId = JWTData.userId as string;

    let chatHistory;

    if (isGroup) {
      chatHistory = await prisma.message.findMany({
        where: {
          groupId: chatFriendUid,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
          sender: {
            select: {
              firstName: true,
              lastName: true,
              image: true,
            },
          },
        },
        ...(numberOfMessages && { take: numberOfMessages }),
      });
    } else {
      chatHistory = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, recipientId: chatFriendUid },
            { senderId: chatFriendUid, recipientId: userId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
        },
        ...(numberOfMessages && { take: numberOfMessages }),
      });
    }

    const formattedChatHistory: Chat[] = chatHistory.map((message: any) => ({
      id: message.id,
      sender: message.senderId === userId ? "user" : "other",
      message: message.content,
      timestamp: message.createdAt.toISOString(),
      ...(isGroup && {
        senderId: message.senderId,
        senderFirstName: message.sender?.firstName,
        senderLastName: message.sender?.lastName,
        senderImage: message.sender?.image,
      }), // Include sender details for group chats
    }));

    return NextResponse.json(
      {
        chatHistory: formattedChatHistory,
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
