import type { Config } from "drizzle-kit";

export default {
  schema: "./src/schema/*",
  driver: "better-sqlite",
  out: "./drizzle",
  dbCredentials: {
    url: "./sqlite.db",
  },
} satisfies Config;
