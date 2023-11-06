// lucia.ts
import { betterSqlite3 } from "@lucia-auth/adapter-sqlite";
import { lucia } from "lucia";
import { express } from "lucia/middleware";
import { sqliteDataBase } from "./db.ts";

export const auth = lucia({
  adapter: betterSqlite3(sqliteDataBase, {
    user: "user",
    session: "user_session",
    key: "user_key",
  }),
  env: process.env.NODE_ENV === "development" ? "DEV" : "PROD",
  middleware: express(),

  getUserAttributes: (data) => {
    return {
      username: data.username,
    };
  },
});

export type Auth = typeof auth;
