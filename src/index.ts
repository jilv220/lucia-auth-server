import express from "express";
import signupRouter from "./routes/signup.ts";
import loginRouter from "./routes/login.ts";
import userRouter from "./routes/user.ts";
import logoutRouter from "./routes/logout.ts";

const app = express();
const port = 3000;

// middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// routes (it has to be "/"...)
app
  .use("/", signupRouter)
  .use("/", loginRouter)
  .use("/", userRouter)
  .use("/", logoutRouter);

app.listen(port, () => {
  console.log(`Http server listening on port ${port}`);
});

/**
 * Error Handling
 */
process.on("uncaughtException", function (err) {
  // Handle the error safely
  console.log(err);
});
