import prisma from "@/utils/prismaClient";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  contextPromise: { params: Promise<{ id: string }> } // 👈 params is a Promise now
) {
  try {
    const { id } = await contextPromise.params; // ✅ await the Promise

    console.log("✅ User ID received:", id);

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        skills: { include: { skill: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
