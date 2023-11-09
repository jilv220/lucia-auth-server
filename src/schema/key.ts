import { text, pgTable } from 'drizzle-orm/pg-core';
import { user } from './user.ts';

export const key = pgTable('user_key', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),
  hashedPassword: text('hashed_password'),
});
