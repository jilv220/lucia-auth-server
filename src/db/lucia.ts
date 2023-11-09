// lucia.ts
import { lucia } from 'lucia';
import { express } from 'lucia/middleware';
import { pg } from '@lucia-auth/adapter-postgresql';
import { neonClient } from './db.ts';

export const auth = lucia({
  adapter: pg(neonClient, {
    user: 'user',
    session: 'user_session',
    key: 'user_key',
  }),
  env: process.env.NODE_ENV === 'development' ? 'DEV' : 'PROD',
  middleware: express(),

  getUserAttributes: (data) => ({
    username: data.username,
    email: data.email,
    emailVerified: data.email_verified,
  }),
});

export type Auth = typeof auth;
