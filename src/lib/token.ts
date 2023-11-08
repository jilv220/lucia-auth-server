import { eq } from "drizzle-orm";
import { HOUR } from "../constant/time.ts";
import { db } from "../db/db.ts";
import { emailVerificationToken } from "../schema/email_verification_token.ts";
import { generateRandomString, isWithinExpiration } from "lucia/utils";
import {
  EXPIRED_EMAIL_VERIFICATION_TOKEN,
  INVALID_EMAIL_VERIFICATION_TOKEN,
} from "../constant/error.ts";

const EXPIRES_IN = 2 * HOUR;

export async function generateEmailVerificationToken(userId: string) {
  const storedUserTokens = await db.query.emailVerificationToken.findMany({
    where: eq(emailVerificationToken.id, userId),
  });
  if (storedUserTokens.length > 0) {
    const reusableStoredToken = storedUserTokens.find((token) => {
      return isWithinExpiration(Number(token.expires) - EXPIRES_IN / 2);
    });
    if (reusableStoredToken) return reusableStoredToken.id;
  }
  const token = generateRandomString(63);
  await db.insert(emailVerificationToken).values({
    id: token,
    expires: BigInt(new Date().getTime() + EXPIRES_IN),
    userId: userId,
  });
  return token;
}

export async function validateEmailVerificationToken(token: string) {
  const storedToken = await db.transaction(async (tx) => {
    const storedToken = await tx.query.emailVerificationToken.findFirst({
      where: eq(emailVerificationToken.id, token),
    });
    if (!storedToken) throw new Error(INVALID_EMAIL_VERIFICATION_TOKEN);
    await tx
      .delete(emailVerificationToken)
      .where(eq(emailVerificationToken.userId, storedToken.userId));
    return storedToken;
  });
  const tokenExpires = Number(storedToken.expires);
  if (!isWithinExpiration(tokenExpires)) {
    throw new Error(EXPIRED_EMAIL_VERIFICATION_TOKEN);
  }
  return storedToken.userId;
}
