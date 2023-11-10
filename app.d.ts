/// <reference types="lucia" />
declare namespace Lucia {
  // this has to point to the lucia config file
  type Auth = import('./src/db/lucia.ts').Auth;
  type DatabaseUserAttributes = {
    username: string;
    email: string;
    email_verified: boolean;
  };
  type DatabaseSessionAttributes = {};
}
