import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./user.ts";

export const key = sqliteTable("user_key", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id),
  hashedPassword: text("hashed_password"),
});
