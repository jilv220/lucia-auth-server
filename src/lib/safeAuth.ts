import { Result } from '@badrap/result';
import { auth } from '../db/lucia.ts';
import { ArgumentsType } from './utilTypes.ts';

type authCreateUserArgs = ArgumentsType<typeof auth.createUser>;
export function authCreateUserSafe(...args: authCreateUserArgs) {
  return auth.createUser(...args).then(
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
