import { Router } from "express";
import { userSelectSchema } from "../validator/user.ts";
import { buildErrorResponse } from "../lib/utils.ts";
import { auth } from "../db/lucia.ts";
import { authUsekeySafe } from "../lib/safeAuth.ts";
import {
  INCORRECT_USERNAME_OR_PASSWORD,
  UNKNOWN_ERR,
} from "../constant/error.ts";

const router = Router();
router.post("/login", async (req, res) => {
  const userParseRes = userSelectSchema.safeParse(req.body);

  if (!userParseRes.success) {
    const formatted = userParseRes.error.format();
    if (formatted.username) {
      return buildErrorResponse(res, "Invalid username");
    }
    if (formatted.password) {
      return buildErrorResponse(res, "Invalid password");
    }
    return buildErrorResponse(res, "Unknown parse error");
  }

  const { username, password } = userParseRes.data;
  const key = await authUsekeySafe(
    "username",
    username.toLowerCase(),
    password
  );
  if (key.isErr && key.error instanceof Error) {
    switch (key.error.message) {
      case "AUTH_INVALID_KEY_ID":
        return buildErrorResponse(res, INCORRECT_USERNAME_OR_PASSWORD);
      case "AUTH_INVALID_PASSWORD":
        return buildErrorResponse(res, INCORRECT_USERNAME_OR_PASSWORD);
    }
    return buildErrorResponse(res, UNKNOWN_ERR);
  }

  const session = await auth.createSession({
    userId: key.unwrap().userId,
    attributes: {},
  });
  const user = await auth.getUser(key.unwrap().userId);

  return res.json({
    token: session.sessionId,
    user,
  });
});

export default router;
