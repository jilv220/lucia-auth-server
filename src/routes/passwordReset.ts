import { Router } from 'express';
import { eq } from 'drizzle-orm';
import {
  passwordResetSchema,
  requestPasswordResetSchema,
} from '../validator/user.ts';
import {
  buildClientErrorResponse,
  buildUnknownErrorResponse,
} from '../lib/utils.ts';
import { db } from '../db/db.ts';
import { user } from '../schema/user.ts';
import { passwordResetTM } from '../models/tokenManger.ts';
import { sendPasswordResetLink } from '../lib/email.ts';
import { auth } from '../db/lucia.ts';
import { EXPIRED_TOKEN, INVALID_TOKEN } from '../constant/error.ts';

const router = Router();
router.post('/password-reset', async (req, res) => {
  const parseRes = requestPasswordResetSchema.safeParse(req.body);
  if (!parseRes.success) {
    const formatted = parseRes.error.format();
    if (formatted.email) {
      return buildClientErrorResponse(res, 'Invalid Email');
    }
    return buildUnknownErrorResponse(res);
  }
  const { email } = parseRes.data;

  try {
    const storedUser = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!storedUser) {
      return buildClientErrorResponse(res, 'User does not exist');
    }
    const token = await passwordResetTM.generate(storedUser.id);
    sendPasswordResetLink(email, token);

    return res.send();
  } catch (e) {
    if (e instanceof Error) {
      console.error(e);
    }
    return buildUnknownErrorResponse(res);
  }
});

router.post('/password-reset/:token', async (req, res) => {
  const parseRes = passwordResetSchema.safeParse(req.body);
  if (!parseRes.success) {
    const formatted = parseRes.error.format();
    if (formatted.password) {
      return buildClientErrorResponse(res, formatted.password._errors);
    }
    return buildUnknownErrorResponse(res);
  }

  const { password } = parseRes.data;
  try {
    const { token } = req.params;
    const userId = await passwordResetTM.validate(token);
    const userFound = await auth.getUser(userId);

    await auth.invalidateAllUserSessions(userFound.userId);
    await auth.updateKeyPassword('email', userFound.email, password);
    const session = await auth.createSession({
      userId: userFound.userId,
      attributes: {},
    });
    const authRequest = auth.handleRequest(req, res);
    authRequest.setSession(session);
    return res.json({
      redirectTo: '/',
    });
  } catch (e) {
    if (e instanceof Error) {
      switch (e.message) {
        case INVALID_TOKEN:
          return buildClientErrorResponse(res, INVALID_TOKEN);
        case EXPIRED_TOKEN:
          return buildClientErrorResponse(res, EXPIRED_TOKEN);
        default:
          return buildUnknownErrorResponse(res);
      }
    }
    console.error(e);
    return buildUnknownErrorResponse(res);
  }
});

export default router;
