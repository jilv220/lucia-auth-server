import { bigint, text, pgTable } from 'drizzle-orm/pg-core';
import { user } from './user.ts';

export const session = pgTable('user_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, {
      onDelete: 'cascade',
    }),
  activeExpires: bigint('active_expires', {
    mode: 'bigint',
  }).notNull(),
  idleExpires: bigint('idle_expires', {
    mode: 'bigint',
  }).notNull(),
});
