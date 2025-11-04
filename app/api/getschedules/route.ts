import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/utils/prismaClient";
import jwt  from "jsonwebtoken";
export async function POST(request: Request) {
    const cookiesData = await cookies();  
    const token = await cookiesData.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    //@ts-ignore
    const id = jwt.decode(token)?.id as string;
    if (!id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const requests = await prisma.teaching.findMany({
        where:{
            OR:[ 
                {userId:id}, 
                {friendId:id}
            ],
            isAccepted:true
        },
        include:{
            other :{
                select:{
                    name:true,
                    stars:true,
                    skills:true,
                    email:true,
                    experience:true,
                }
            },
            user:{
                select:{
                    name:true
                }
            }
        }
    })
    return NextResponse.json({ requests:requests.reverse() }, { status: 200 });
}