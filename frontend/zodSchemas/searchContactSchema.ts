import { z } from "zod";

const searchContactSchema = z.object({
  searchText: z.string().min(3).max(100),
});

export default searchContactSchema;
