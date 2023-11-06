import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import sqlite from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";

export const sqliteDataBase: sqlite.Database = new sqlite("sqlite.db");

export const db = drizzle(sqliteDataBase);

migrate(db, { migrationsFolder: "drizzle" });
