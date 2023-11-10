import { transporter } from '../config/email.ts';
import { TOKEN_TYPE } from '../models/tokenManger.ts';

function buildTokenOpts(email: string, token: string, tokenType: TOKEN_TYPE) {
  let endPoint;
  let msg;
  let subject;

  const domainURL = process.env.DOMAIN_URL!;

  // eslint-disable-next-line default-case
  switch (tokenType) {
    case 'email_verification':
      endPoint = 'email-verification';
      msg = 'Click Here to Verify Your Account';
      subject = 'Verify Your Account Now';
      break;
    case 'password_reset':
      endPoint = 'password-reset';
      msg = 'Click Here to Reset Your Password';
      subject = 'Reset Your Password';
      break;
  }
  const url = `${domainURL}/${endPoint}/${token}`;

  return {
    from: process.env.SMTP_USER!,
    to: email,
    subject,
    text: `${url} ${msg}`,
    html: `<a href=${url}>${msg}</a>`,
  };
}

const sendTokenLink = (email: string, token: string, tokenType: TOKEN_TYPE) => {
  const emailOpts = buildTokenOpts(email, token, tokenType);
  transporter
    .sendMail(emailOpts)
    .then((info) => {
      console.log(`Email sent: ${info.messageId}`);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const sendEmailVerificationLink = (email: string, token: string) =>
  sendTokenLink(email, token, 'email_verification');

export const sendPasswordResetLink = (email: string, token: string) =>
  sendTokenLink(email, token, 'password_reset');
