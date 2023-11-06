import { Router } from "express";
import { auth } from "../db/lucia.ts";
import { buildErrorResponse } from "../lib/utils.ts";

const router = Router();

router.get("/user", async (req, res) => {
  const authRequest = auth.handleRequest(req, res);
  const session = await authRequest.validateBearerToken();
  if (session) {
    return res.send(`Welcome user: ${session.user.username}`);
  }
  return buildErrorResponse(res, "Unathorized");
});

export default router;
