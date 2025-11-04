import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/utils/prismaClient";
export async function POST(params: Request) {
    const cookiesData = await cookies();
    let tutors =await prisma.user.findMany({
        include:{
            skills:{
                include:{
                    skill:true
                }
            }
        }
    })
    const token = cookiesData.get("token")?.value || "";
    //@ts-ignore
    const email = jwt.decode(token)?.email as string;
    tutors = tutors.filter((tutor) => tutor.email !== email).reverse();
    return NextResponse.json({tutors});
}