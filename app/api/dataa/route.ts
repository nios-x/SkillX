import { NextResponse } from "next/server"
import prisma from "@/utils/prismaClient";
export async function POST(request: Request) {
    const {id} = await request.json()
    const userdata = await prisma.user.findUnique({
        where: { id },
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