import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 🧠 Increment user points by 1 (or adjust as needed)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        points: {
          increment: 1, // increase by 1 each time
          
        },
        stars:{
          increment:0.1
        }
        
      },
      select: {
        id: true,
        points: true,
      },
    });

    return NextResponse.json(
      { success: true, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error increasing points:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
