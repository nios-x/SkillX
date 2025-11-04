import { NextResponse } from "next/server";
import prisma from "@/utils/prismaClient"; // adjust path if needed

// POST /api/user/update
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      id,
      name,
      bio,
      designation,
      profileImage,
      stars,
      experience,
      points,
      availability,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Construct update object (explicitly check undefined instead of falsy)
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (designation !== undefined) updateData.designation = designation;
    if (profileImage !== undefined) updateData.profileImage = profileImage;
    if (typeof stars === "number") updateData.stars = stars;
    if (typeof experience === "number") updateData.experience = experience;
    if (typeof points === "number") updateData.points = points;
    if (availability !== undefined) updateData.Availability = availability;

    // Update user in Prisma
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
