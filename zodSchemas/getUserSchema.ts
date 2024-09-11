import { z } from "zod";

const getUserSchema = z.object({
  identifier: z.string().min(6).max(100),
});

export default getUserSchema;
