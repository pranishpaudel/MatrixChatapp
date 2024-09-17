import { z } from "zod";

const getChatHistorySchema = z.object({
  chatFriendUid: z.string().min(1).max(50),
  numberOfMessages: z.number().int().positive().default(10),
});

export default getChatHistorySchema;
