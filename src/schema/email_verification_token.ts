import { relations } from 'drizzle-orm';
import { bigint, text, pgTable } from 'drizzle-orm/pg-core';
import { user } from './user.ts';

export const emailVerificationToken = pgTable('email_verification_token', {
  id: text('id').notNull(),
  expires: bigint('expires', {
    mode: 'bigint',
  }).primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),
});

export const emailVerificationTokenRelations = relations(
  emailVerificationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [emailVerificationToken.userId],
      references: [user.id],
    }),
  }),
);
