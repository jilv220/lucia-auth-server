import { z } from "zod";

export const userInsertSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "username cannot be less than 3 chars",
    })
    .max(32, {
      message: "username cannot be over 32 chars",
    }),
  password: z
    .string()
    .min(12, {
      message: "password cannot be less than 12 chars",
    })
    .max(255, {
      message: "password cannot be over 255 chars",
    }),
});

export const userSelectSchema = userInsertSchema;
