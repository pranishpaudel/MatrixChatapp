import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import {
  getObject,
  putObject,
} from "@/utils/awsReusableFunctions/awsCommandsProvider";
import { NextResponse, NextRequest } from "next/server";

interface iGetObjectProps {
  fileName: string;
  actionType: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
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
    const { fileName, actionType } = reqBody as iGetObjectProps;

    const s3GetUrl = await getObject(
      fileName,
      JWTData.userId as string,
      60 * 60,
      actionType as "open" | "download"
    ); // 1 hour expiration
    return NextResponse.json(
      {
        message: "Get Object Url Generated",
        success: true,
        url: s3GetUrl, // Include the pre-signed URL in the response if needed
      },
      { status: 201 }
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
