import { createTransport } from "nodemailer";
import "dotenv/config";

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

export const transporter = createTransport({
  host,
  port: parseInt(port!) || 465,
  secure: true,
  auth: {
    user,
    pass,
  },
});
