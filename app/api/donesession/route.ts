import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/utils/prismaClient";
import jwt  from "jsonwebtoken";
export async function POST(request: Request) {
    const cookiesData = await cookies();  
    const token = await cookiesData.get("token")?.value;
    const b = await request.json();
    console.log(b)
    const {reqid, aord } = b;
    if(aord==="delete"){
          if (!token) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
            //@ts-ignore
            const id = jwt.decode(token)?.id as string;
        if (!id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await prisma.teaching.deleteMany({
            where:{
                id:reqid
            },
        })
        
    }
    return NextResponse.json({ response:"success" }, { status: 200 });
}