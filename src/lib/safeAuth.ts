import { Result } from "@badrap/result";
import { auth } from "../db/lucia.ts";
import { ArgumentsType } from "./utils.ts";

export function authCreateUserSafe(options: {
  userId?: string;
  key: {
    providerId: string;
    providerUserId: string;
    password: string | null;
  } | null;
  attributes: Lucia.DatabaseUserAttributes;
}) {
  return auth.createUser(options).then(
    (v) => Result.ok(v),
    (e) => Result.err(e)
  );
}

type useKeyArgs = ArgumentsType<typeof auth.useKey>;
export function authUsekeySafe(...args: useKeyArgs) {
  return auth.useKey(...args).then(
    (v) => Result.ok(v),
    (e) => Result.err(e)
  );
}
