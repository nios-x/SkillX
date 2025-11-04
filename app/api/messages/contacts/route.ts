import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const contacts = await prisma.user.findMany({
      where: {
        OR: [
          { sentMessages: { some: { receiverId: userId } } },
          { receivedMessages: { some: { senderId: userId } } },
        ],
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
      },
    });

    return NextResponse.json({ contacts });
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
