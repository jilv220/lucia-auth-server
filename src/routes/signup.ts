import { Router } from "express";
import { userInsertSchema } from "../validator/user.ts";
import { auth } from "../db/lucia.ts";
import { authCreateUserSafe } from "../lib/safeAuth.ts";

const router: Router = Router();

router.post("/signup", async (req, res) => {
  const userParseRes = userInsertSchema.safeParse(req.body);

  if (!userParseRes.success) {
    const formatted = userParseRes.error.format();
    if (formatted.username) {
      return res.status(400).json(formatted.username._errors);
    }
    if (formatted.password) {
      return res.status(400).json(formatted.password._errors);
    }
    return res.status(400).json(["unknown error"]);
  }

  const userToInsert = userParseRes.data;
  const user = await authCreateUserSafe({
    key: {
      providerId: "username",
      providerUserId: userToInsert.username.toLowerCase(),
      password: userToInsert.password,
    },
    attributes: {
      username: userToInsert.username,
    },
  });

  if (user.isErr && user.error instanceof Error) {
    switch (user.error.message) {
      case "AUTH_DUPLICATE_KEY_ID":
        return res.status(400).json({
          error: "Username is not unique",
        });
    }
    return res.status(400).json({
      error: "Unknown erorr",
    });
  }

  const session = await auth.createSession({
    userId: user.unwrap().userId,
    attributes: {},
  });

  return res.json({
    token: session.sessionId,
    user: user.unwrap(),
  });
});

export default router;
