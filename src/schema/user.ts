import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { emailVerificationToken } from "./email_verification_token.ts";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  email: text("email").notNull().default(""),
  emailVerified: integer("email_verified", {
    mode: "boolean",
  }),
});

export const userRelations = relations(user, ({ many }) => ({
  emailVerificationToken: many(emailVerificationToken),
}));
