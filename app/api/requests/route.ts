import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/utils/prismaClient";
export async function POST(req:Request){
    const {tutorid, skill, desc } = await req.json();
    const cookiesData = await cookies();
    try{
        const token = cookiesData.get("token")?.value || "";
        //@ts-ignore
        const userid = jwt.verify(token,"SECRET")?.id as string;
        
        const x = await prisma.teaching.create({
            data:{
                userId:tutorid,
                friendId: userid,
                isAccepted:false,
                desc,
                skill
            }
        })
        console.log(x);
        return NextResponse.json({response:"SuccessFully Request"})
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Server error " }, { status: 500 });
    }

}