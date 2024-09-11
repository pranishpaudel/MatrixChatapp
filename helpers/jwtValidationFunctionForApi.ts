import { NextRequest } from "next/server";
import jwtValidationFunction from "./jwtValidationFunctionForMiddleware";

const isJWTValidForApi = async (req: NextRequest) => {
  const tokenFromCookie = req.cookies.get("token")?.value || "";

  // Check for token in Authorization header
  const authorizationHeader = req.headers.get("Authorization") || "";
  const tokenFromHeader = authorizationHeader.startsWith("Bearer ")
    ? authorizationHeader.slice("Bearer ".length).trim()
    : "";

  // Choose the token source, prefer Authorization header over cookies
  const token = tokenFromHeader || tokenFromCookie;

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
