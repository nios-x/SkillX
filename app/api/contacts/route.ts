// app/api/contacts/route.ts

import prisma from "@/utils/prismaClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  // Get all users that current user has chatted with
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    select: {
      senderId: true,
      receiverId: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });

  // Extract unique contacts
  const contactsSet = new Set<string>();
  messages.forEach((msg:any) => {
    if (msg.senderId !== userId) contactsSet.add(msg.senderId);
    if (msg.receiverId !== userId) contactsSet.add(msg.receiverId);
  });

  const contacts = await prisma.user.findMany({
    where: { id: { in: Array.from(contactsSet) } },
    select: { id: true, name: true, profileImage: true }
  });

  return NextResponse.json(contacts);
}
