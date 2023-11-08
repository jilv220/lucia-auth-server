import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import sqlite from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { user } from "../schema/user.ts";
import { emailVerificationToken } from "../schema/email_verification_token.ts";

export const sqliteDataBase: sqlite.Database = new sqlite("sqlite.db");

export const db = drizzle(sqliteDataBase, {
  schema: {
    user,
    emailVerificationToken,
  },
});

migrate(db, { migrationsFolder: "drizzle" });
