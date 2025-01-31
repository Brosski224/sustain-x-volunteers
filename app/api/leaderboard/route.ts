import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/user";

export async function GET() {
  try {
    const db = await connectDB();
    if (!db) {
      throw new Error("Database connection failed");
    }

    const users = await User.find();

    const leaderboardData = users.map((user) => ({
      name: user.name,
      department: user.department,
      section: user.section,
      emailCount: user.emailCount || 0,
      ticketSold: user.ticketSold || 0,
      points: user.points || 0,
    }));

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}