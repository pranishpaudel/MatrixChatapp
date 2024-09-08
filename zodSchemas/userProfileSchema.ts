import { z } from "zod";

const saveUserProfileSchema = z.object({
  firstName: z.string().min(6).max(100),
  lastName: z.string().min(6).max(100),
  email: z.string().email(),
  profileImageBase64: z.string().min(100),
});

export default saveUserProfileSchema;
