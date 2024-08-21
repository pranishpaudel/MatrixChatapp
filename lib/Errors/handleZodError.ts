import { NextResponse } from "next/server";
import { z } from "zod";

function handleZodError(error: z.ZodError) {
  return NextResponse.json(
    {
      message: "Validation failed",
      errors: error.errors,
      success: false,
    },
    { status: 400 }
  );
}
export default handleZodError;
