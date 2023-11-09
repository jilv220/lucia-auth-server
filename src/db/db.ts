import 'dotenv/config';

import { Pool, neonConfig } from '@neondatabase/serverless';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/neon-serverless';

import ws from 'ws';
import { emailVerificationToken } from '../schema/email_verification_token.ts';
import { user } from '../schema/user.ts';

neonConfig.webSocketConstructor = ws;

export const neonClient = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle(neonClient, {
  schema: {
    user,
    emailVerificationToken,
  },
});

migrate(db, { migrationsFolder: 'drizzle' });
