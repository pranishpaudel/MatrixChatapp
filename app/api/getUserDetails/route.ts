import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import getUserDataFromPrisma from "@/helpers/prismaUserDetailsProvider";
import handleZodError from "@/lib/Errors/handleZodError";
import prisma from "@/prisma/prisma.config";
import getUserSchema from "@/zodSchemas/getUserSchema";
import saveUserProfileSchema from "@/zodSchemas/userProfileSchema";
import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
interface iGetUserBody {
  identifier: string;
  data: string;
}
export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const JWTData = await isJWTValidForApi(req);
    console.log(JWTData);
    const reqBody = await req.json();
    getUserSchema.parse(reqBody);
    const { identifier, data } = reqBody as iGetUserBody;
    //identify if email or id

    if (!JWTData.success) {
      return NextResponse.json(
        {
          message: "Unauthorized",
          success: false,
        },
        { status: 401 }
      );
    }
    //get data
    const dataFromPrisma = await getUserDataFromPrisma(identifier, data);
    return NextResponse.json({ data: dataFromPrisma, success: true });
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
