import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  // Remove the JWT token by setting the cookie with an expired date
  const response = NextResponse.json({
    message: "Logged out successfully",
    success: true,
  });
  response.cookies.set("token", "", {
    httpOnly: true,
    expires: new Date(0), // Set the cookie to expire immediately
  });
  return response;
}
