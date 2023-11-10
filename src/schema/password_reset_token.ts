import { relations } from 'drizzle-orm';
import { bigint, pgTable, text } from 'drizzle-orm/pg-core';
import { user } from './user.ts';

export const passwordResetToken = pgTable('password_reset_token', {
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

export const passwordResetTokenRelations = relations(
  passwordResetToken,
  ({ one }) => ({
    user: one(user, {
      fields: [passwordResetToken.userId],
      references: [user.id],
    }),
  })
);
