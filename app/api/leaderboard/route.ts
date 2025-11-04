import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient"; // adjust if your path differs

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        points: true,
        skills: {
          select: { skill: true },
        },
      },
      orderBy: { points: "desc" }, // sort by points
    });

    // Compute ranks dynamically
    const leaderboard = users.map((user:any, index:any) => ({
        id:user.id,
      rank: index + 1,
      name: user.name,
      skills: user.skills.length,
      points: user.points,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}
