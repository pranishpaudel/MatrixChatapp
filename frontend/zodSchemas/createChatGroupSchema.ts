import { z } from "zod";

const chatGroupSchema = z.object({
  groupName: z.string().min(1).max(100),
  groupMembers: z.array(z.string()),
});

export default chatGroupSchema;
