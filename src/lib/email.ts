import { transporter } from "../config/email.ts";

export const sendEmailVerificationLink = async (
  email: string,
  token: string
) => {
  const domainURL = process.env.DOMAIN_URL!;
  const url = `${domainURL}/email-verification/${token}`;
  const msg = "Click Here to Verify Your Account";

  const mailOpts = {
    from: process.env.SMTP_USER!,
    to: email,
    subject: "Verify Your Account Now",
    text: `${url} ${msg}`,
    html: `<a href=${url}>${msg}</a>`,
  };

  await transporter.sendMail(mailOpts);
};
