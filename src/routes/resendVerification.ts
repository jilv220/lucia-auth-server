import { Router } from 'express';
import { auth } from '../db/lucia.ts';
import { sendEmailVerificationLink } from '../lib/email.ts';
import {
  buildClientErrorResponse,
  buildUnknownErrorResponse,
} from '../lib/utils.ts';
import { emailVerificationTM } from '../models/tokenManger.ts';
import {
  EXPIRED_EMAIL_VERIFICATION_TOKEN,
  INVALID_EMAIL_VERIFICATION_TOKEN,
} from '../constant/error.ts';

const router = Router();

router.post('/email-verification', async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  let session = await authRequest.validate();
  if (!session) {
    session = await authRequest.validateBearerToken();
  }
  if (!session) return res.status(401).end();

  if (session.user.emailVerified) {
    return res.status(422).end();
  }
  try {
    const token = await emailVerificationTM.generate(session.user.userId);
    sendEmailVerificationLink(session.user.email, token);
    return res.end();
  } catch (e) {
    console.error(e);
    return buildUnknownErrorResponse(res);
  }
});

router.get('/email-verification/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const userId = await emailVerificationTM.validate(token);
    const user = await auth.getUser(userId);
    await auth.invalidateAllUserSessions(user.userId);
    await auth.updateUserAttributes(user.userId, {
      email_verified: true,
    });
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    return res.sendStatus(302);
  } catch (e) {
    if (e instanceof Error) {
      switch (e.message) {
        case INVALID_EMAIL_VERIFICATION_TOKEN:
          return buildClientErrorResponse(
            res,
            'Invalid Email Verification Link'
          );
        case EXPIRED_EMAIL_VERIFICATION_TOKEN:
          return buildClientErrorResponse(
            res,
            'Invalid Email Verification Link'
          );
        default:
          console.error(e);
          return buildUnknownErrorResponse(res);
      }
    }
    console.error(e);
    return buildUnknownErrorResponse(res);
  }
});

export default router;
