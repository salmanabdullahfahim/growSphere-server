import nodemailer from "nodemailer";
import config from "../../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: config.email_user,
      pass: config.email_pass,
    },
  });

  await transporter.sendMail({
    from: '"GrowSphere Support" <fxfahim101@gmail.com>', // sender address
    to, // list of receivers
    subject: "Reset Password Within 10 Minutes - GrowSphere", // Subject line
    text: "", // plain text body
    html,
  });
};
