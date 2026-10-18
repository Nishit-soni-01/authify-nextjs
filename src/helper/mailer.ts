import nodemailer from "nodemailer";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import crypto from "crypto";

type EmailType = "VERIFY" | "RESET";

interface SendEmailParams {
  email: string;
  emailType: EmailType;
  userId: string;
}

const transport = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT || 2525),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function sendEmail({
  email,
  emailType,
  userId,
}: SendEmailParams) {
  await connect();

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiry = new Date(Date.now() + 60 * 60 * 1000);

  const update =
    emailType === "VERIFY"
      ? { verifyToken: hashedToken, verifyTokenExpiry: expiry }
      : {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: expiry,
        };

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  );

  if (!user) {
    throw new Error("User not found");
  }

  const domain = process.env.DOMAIN;

  if (!domain) {
    throw new Error("DOMAIN is missing");
  }

  const path =
    emailType === "VERIFY" ? "/verifyemail" : "/resetpassword";

  const link = new URL(path, domain);
  link.searchParams.set("token", rawToken);

  const subject =
    emailType === "VERIFY"
      ? "Verify your Authify account"
      : "Reset your Authify password";

  return transport.sendMail({
    from: "Authify <from@example.com>",
    to: email,
    subject,
    text: `${subject}: ${link.toString()}`,
    html: `
      <h2>${subject}</h2>
      <p>Click the link below to continue. It expires in one hour.</p>
      <a href="${link.toString()}">${subject}</a>
    `,
  });
}