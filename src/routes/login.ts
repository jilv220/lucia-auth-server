import { Router } from "express";
import { userSelectSchema } from "../validator/user.ts";
import { buildClientErrorResponse } from "../lib/utils.ts";
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
      return buildClientErrorResponse(res, "Invalid username");
    }
    if (formatted.password) {
      return buildClientErrorResponse(res, "Invalid password");
    }
    return buildClientErrorResponse(res, "Unknown parse error");
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
        return buildClientErrorResponse(res, INCORRECT_USERNAME_OR_PASSWORD);
      case "AUTH_INVALID_PASSWORD":
        return buildClientErrorResponse(res, INCORRECT_USERNAME_OR_PASSWORD);
    }
    return buildClientErrorResponse(res, UNKNOWN_ERR);
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
