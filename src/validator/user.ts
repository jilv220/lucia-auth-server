import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../schema/user.ts';

const baseUserInsertSchema = createInsertSchema(user).omit({
  id: true,
  emailVerified: true,
});

export const userInsertSchemaOverride = z.object({
  username: z
    .string()
    .min(3, {
      message: 'username cannot be less than 3 chars',
    })
    .max(32, {
      message: 'username cannot be over 32 chars',
    }),
  password: z
    .string()
    .min(12, {
      message: 'password cannot be less than 12 chars',
    })
    .max(255, {
      message: 'password cannot be over 255 chars',
    }),
  email: z.string().email({
    message: 'invalid email',
  }),
});

export const userInsertSchema = baseUserInsertSchema.merge(
  userInsertSchemaOverride,
);

export const userSelectSchema = userInsertSchema;
