import { relations } from 'drizzle-orm';
import { boolean, pgTable, text } from 'drizzle-orm/pg-core';
import { emailVerificationToken } from './email_verification_token.ts';
import { passwordResetToken } from './password_reset_token.ts';

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull(),
  email: text('email').notNull().default(''),
  emailVerified: boolean('email_verified'),
});

export const userRelations = relations(user, ({ many }) => ({
  emailVerificationToken: many(emailVerificationToken),
  passwordRestToken: many(passwordResetToken),
}));
