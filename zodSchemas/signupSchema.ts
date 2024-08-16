import { z } from "zod";

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
  confirmPassword: z.string().min(6).max(100),
});

export default signupSchema;
