import express from 'express';
import rootRouter from './routes/root.ts';
import 'dotenv/config';

const app = express();
const port = 3000;

// middleware
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Routes
app.use('/', rootRouter);

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
