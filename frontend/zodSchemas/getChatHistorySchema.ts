import { z } from "zod";

const getChatHistorySchema = z.object({
  chatFriendUid: z.string(),
  numberOfMessages: z.number().optional(),
  isGroup: z.boolean().optional().default(false),
});
export default getChatHistorySchema;
