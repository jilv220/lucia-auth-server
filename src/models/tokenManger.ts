import { eq } from 'drizzle-orm';
import { isWithinExpiration, generateRandomString } from 'lucia/utils';
import { HOUR } from '../constant/time.ts';
import { db } from '../db/db.ts';
import { emailVerificationToken } from '../schema/email_verification_token.ts';
import { IToken } from '../types/token.ts';
import { passwordResetToken } from '../schema/password_reset_token.ts';
import { EXPIRED_TOKEN, INVALID_TOKEN } from '../constant/error.ts';

export type TOKEN_TYPE = 'email_verification' | 'password_reset';

function buildTokenDAO(tokenType: TOKEN_TYPE) {
  let token;
  // eslint-disable-next-line default-case
  switch (tokenType) {
    case 'email_verification':
      token = emailVerificationToken;
      break;
    case 'password_reset':
      token = passwordResetToken;
      break;
  }
  return token;
}

function buildTokenQuery(tokenType: TOKEN_TYPE) {
  let dbQuery;

  // eslint-disable-next-line default-case
  switch (tokenType) {
    case 'email_verification':
      dbQuery = db.query.emailVerificationToken;
      break;
    case 'password_reset':
      dbQuery = db.query.passwordResetToken;
      break;
  }
  return dbQuery;
}

class TokenManager implements IToken {
  private tokenDAO;

  private accessor tokenType: TOKEN_TYPE;

  private dbQuery;

  private expiresIn: number;

  constructor(tokenType: TOKEN_TYPE, expiresIn?: number) {
    this.tokenType = tokenType;
    this.expiresIn = expiresIn || 2 * HOUR;
    this.tokenDAO = buildTokenDAO(tokenType);
    this.dbQuery = buildTokenQuery(tokenType);
  }

  async generate(userId: string) {
    const storedUserTokens = await this.dbQuery.findMany({
      where: eq(this.tokenDAO.id, userId),
    });
    if (storedUserTokens.length > 0) {
      const reusableStoredToken = storedUserTokens.find((token) =>
        isWithinExpiration(Number(token.expires) - this.expiresIn / 2)
      );
      if (reusableStoredToken) return reusableStoredToken.id;
    }
    const token = generateRandomString(63);
    await db.insert(this.tokenDAO).values({
      id: token,
      expires: BigInt(new Date().getTime() + this.expiresIn),
      userId,
    });
    return token;
  }

  async validate(token: string) {
    const storedToken = await db.transaction(async (tx) => {
      const tokenInDB = await this.dbQuery.findFirst({
        where: eq(this.tokenDAO.id, token),
      });
      if (!tokenInDB) throw new Error(INVALID_TOKEN);
      await tx
        .delete(this.tokenDAO)
        .where(eq(this.tokenDAO.userId, tokenInDB.userId));
      return tokenInDB;
    });
    const tokenExpires = Number(storedToken.expires);
    if (!isWithinExpiration(tokenExpires)) {
      throw new Error(EXPIRED_TOKEN);
    }
    return storedToken.userId;
  }
}

export const emailVerificationTM = new TokenManager('email_verification');
export const passwordResetTM = new TokenManager('password_reset');
