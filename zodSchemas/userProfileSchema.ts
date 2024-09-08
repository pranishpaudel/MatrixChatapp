import { z } from "zod";

const saveUserProfileSchema = z.object({
  firstName: z.string().min(6).max(100),
  lastName: z.string().min(6).max(100),
  profilePictureBase64: z.string().min(100).max(1000000),
});

export default saveUserProfileSchema;
