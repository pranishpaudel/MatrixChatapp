import { z } from "zod";

const addFriendSchema = z.object({
  friendId: z.string().min(3).max(100),
});

export default addFriendSchema;
