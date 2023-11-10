import { Router } from 'express';
import { auth } from '../db/lucia.ts';

const router = Router();
router.post('/logout', async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  let session = await authRequest.validate();
  if (!session) {
    session = await authRequest.validateBearerToken();
  }
  if (!session) {
    return res.sendStatus(401);
  }
  await auth.invalidateSession(session.sessionId);
  authRequest.setSession(null);
  return res.sendStatus(200);
});

export default router;
