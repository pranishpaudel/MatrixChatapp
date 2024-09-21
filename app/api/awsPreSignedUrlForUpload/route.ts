import isJWTValidForApi from "@/helpers/jwtValidationFunctionForApi";
import { putObject } from "@/utils/awsReusableFunctions/awsCommandsProvider";
import { NextResponse, NextRequest } from "next/server";

interface iSignedUrlProps {
  fileName: string;
  fileType: string;
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
    const { fileName, fileType } = reqBody as iSignedUrlProps;

    const preSignedUrl = await putObject(
      fileName,
      fileType,
      JWTData.userId as string,
      60 * 5 // 5 minutes
    );

    return NextResponse.json(
      {
        message: "Pre-signed URL generated successfully",
        success: true,
        url: preSignedUrl, // Include the pre-signed URL in the response if needed
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
