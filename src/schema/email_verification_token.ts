import { blob, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user.ts";
import { relations } from "drizzle-orm";

export const emailVerificationToken = sqliteTable("email_verification_token", {
  id: text("id").notNull(),
  expires: blob("expires", {
    mode: "bigint",
  }).primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, {
      onDelete: "cascade",
    }),
});

export const emailVerificationTokenRelations = relations(
  emailVerificationToken,
  ({ one }) => ({
    user: one(user, {
      fields: [emailVerificationToken.userId],
      references: [user.id],
    }),
  })
);
