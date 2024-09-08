import { NextRequest } from "next/server";
import jwtValidationFunction from "./jwtValidationFunctionForMiddleware";

const isJWTValidForApi = async (req: NextRequest) => {
  const token = req.cookies.get("token")?.value || "";

  const jwtData = await jwtValidationFunction(token);

  if (!jwtData.success) {
    return {
      success: false,
      userId: null,
      email: null,
    };
  }

  return {
    success: true,
    userId: jwtData.userId || null,
    email: jwtData.email || null,
  };
};

export default isJWTValidForApi;
