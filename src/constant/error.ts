export const UNKNOWN_ERR = 'Unknown error';
export const INCORRECT_USERNAME_OR_PASSWORD = 'Incorrect username or password';
export const INCORRECT_EMAIL_OR_PASSWORD = 'Incorrect email or password';
export const INVALID_EMAIL_VERIFICATION_TOKEN = 'Invalid email verification token';
export const EXPIRED_EMAIL_VERIFICATION_TOKEN = 'Expired email verification token';

export class EmailVerificationTokenError extends Error {}
