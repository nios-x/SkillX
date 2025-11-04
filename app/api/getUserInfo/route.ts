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
    const email = jwt.decode(token)?.email as string;
    const userdata = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            stars: true,
            designation: true,
            points: true,
            profileImage:true  
        },
    });     
    if (!userdata) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user: userdata }, { status: 200 });
}