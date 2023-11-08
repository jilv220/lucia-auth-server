import { Router } from "express";
import { userInsertSchema } from "../validator/user.ts";
import { auth } from "../db/lucia.ts";
import { authCreateUserSafe } from "../lib/safeAuth.ts";
import { buildClientErrorResponse } from "../lib/utils.ts";
import { UNKNOWN_ERR } from "../constant/error.ts";
import { generateEmailVerificationToken } from "../lib/token.ts";
import { sendEmailVerificationLink } from "../lib/email.ts";

const router: Router = Router();

router.post("/signup", async (req, res) => {
  const userParseRes = userInsertSchema.safeParse(req.body);

  if (!userParseRes.success) {
    const formatted = userParseRes.error.format();
    if (formatted.username) {
      return buildClientErrorResponse(res, formatted.username._errors);
    }
    if (formatted.password) {
      return buildClientErrorResponse(res, formatted.password._errors);
    }
    if (formatted.email) {
      return buildClientErrorResponse(res, formatted.email._errors);
    }
    return buildClientErrorResponse(res, UNKNOWN_ERR);
  }

  const { email, password, username } = userParseRes.data;
  const userCreateRes = await authCreateUserSafe({
    key: {
      providerId: "email",
      providerUserId: email.toLowerCase(),
      password,
    },
    attributes: {
      username: username,
      email: email.toLowerCase(),
      email_verified: 0,
    },
  });

  if (userCreateRes.isErr && userCreateRes.error instanceof Error) {
    switch (userCreateRes.error.message) {
      case "AUTH_DUPLICATE_KEY_ID":
        return res.status(400).json({
          error: "Account already exists",
        });
    }
    console.log(userCreateRes.error);
    return res.status(400).json({
      error: "Unknown erorr",
    });
  }
  const user = userCreateRes.unwrap();

  const session = await auth.createSession({
    userId: user.userId,
    attributes: {},
  });

  const token = await generateEmailVerificationToken(user.userId);
  sendEmailVerificationLink(user.email, token);

  const sessionCookie = auth.createSessionCookie(session);
  res.setHeader("Set-Cookie", sessionCookie.serialize());
  res.sendStatus(302);
});

export default router;
