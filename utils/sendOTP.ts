// app/api/send-otp/route.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "devnios7@gmail.com",
    pass: "wehvnnguaxmakwng", // Use environment variable in production
  },
});

export default async function (email: string, otp: string) {
  try {
    const info = await transporter.sendMail({
      from: '"SkillX" <devnios7@gmail.com>',
      to: email,
      subject: "OTP From SkillX",
      html: `<p>Your OTP is <b>${otp}</b></p>`,
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error(err);
  }
}
