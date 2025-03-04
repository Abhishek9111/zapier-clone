import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  host: process.env.SMTP_ENDPOINT,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function sendEmail(to: string, body: string) {
  await transport.sendMail({
    from: "support@zapierClone.com",
    sender: "support@zapierClone.com",
    to,
    subject: "Your actions from zapier",
    text: body,
  });
}
