import { Router } from 'express';
import signupRouter from './signup.ts';
import loginRouter from './login.ts';
import logoutRouter from './logout.ts';
import emailVerificationRouter from './resendVerification.ts';
import passwordResetRouter from './passwordReset.ts';

const router = Router();
const ROOT = '/';

router
  .use(ROOT, signupRouter)
  .use(ROOT, loginRouter)
  .use(ROOT, logoutRouter)
  .use(ROOT, emailVerificationRouter)
  .use(ROOT, passwordResetRouter);

export default router;
