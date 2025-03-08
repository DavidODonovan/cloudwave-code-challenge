import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(2).max(50),
});

export function validateUser(data) {
  return userSchema.safeParse(data);

}
