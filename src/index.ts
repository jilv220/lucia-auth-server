import express from 'express';
import signupRouter from './routes/signup.ts';
import loginRouter from './routes/login.ts';
import userRouter from './routes/user.ts';
import logoutRouter from './routes/logout.ts';
import emailVerificationRouter from './routes/resendVerification.ts';
import 'dotenv/config';

const app = express();
const port = 3000;

// middleware
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

// Routes
app
  .use('/', signupRouter)
  .use('/', loginRouter)
  .use('/', userRouter)
  .use('/', logoutRouter)
  .use('/', emailVerificationRouter);

app.listen(port, () => {
  console.log(`Http server listening on port ${port}`);
});

/**
 * Error Handling
 */
process.on('uncaughtException', (err) => {
  // Handle the error safely
  console.log(err);
});
