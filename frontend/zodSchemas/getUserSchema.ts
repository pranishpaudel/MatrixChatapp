import { z } from "zod";

const getUserSchema = z.object({
  data: z.array(z.string()).min(1).max(10000),
});

export default getUserSchema;
