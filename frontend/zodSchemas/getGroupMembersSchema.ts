import { z } from "zod";

const getGroupMembersSchema = z.object({
  groupId: z.string().min(1).max(100),
});

export default getGroupMembersSchema;
