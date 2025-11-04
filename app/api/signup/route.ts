import { NextResponse } from "next/server";
import generateOTP from "@/utils/generateOTP";
import prisma from "@/utils/prismaClient";
import sendOTP from "@/utils/sendOTP";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export async function POST(req: Request) {
  const data = await req.json();
  console.log(data)
  if(data.stage==1){
      const { email, password } = data;
      const otp = generateOTP(); // returns a string or number 
      console.log("OTP Generated", otp);
      try {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry
        await prisma.oTP.upsert({
          where: { email },
          update: { code: otp, expiresAt },
          create: { email, code: otp, expiresAt, password },
        });
         await sendOTP(email, otp); // make sendOTP return inf;
        return NextResponse.json({ success: true });
      } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err }, { status: 500 });
      }
  }
  if(data.stage==2){

    const { otp } = data;
    console.log(otp)
    try {
      const record = await prisma.oTP.findUnique({
        where: { email: data.email },
      });
      if (!record || record.code !== otp || record.expiresAt < new Date()) {
        return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 });
      } 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(record.password, salt);
      const user = await prisma.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.name,
        },
      });
      
      await prisma.oTP.deleteMany({
        where: { email: data.email },
      });
      const response  = NextResponse.json({ success: true });
      const token = jwt.sign({ email: data.email, id:user.id }, "SECRET", { expiresIn: 100 * 60 * 60 * 24 });
      response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600, path: '/' }); 
      return response;
    } catch (err) {
      console.error(err);
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }
  }
}
