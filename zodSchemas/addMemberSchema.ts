import { z } from "zod";

const addMemberSchema = z.object({
  groupId: z.string().min(3).max(100),
  newMember: z.string().min(3).max(100),
});

export default addMemberSchema;
