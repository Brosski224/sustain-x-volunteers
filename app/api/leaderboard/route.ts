import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/user";

export async function GET() {
  try {
    await connectDB();
    console.log("Database connected");

    const users = await User.find().lean();
    console.log("Users fetched:", users.length);

    const leaderboardData = users.map((user) => ({
      name: user.name,
      department: user.department,
      section: user.section,
      emailCount: user.emailCount || 0,
      ticketSold: user.ticketSold || 0,
      points: user.points || 0,
    }));

    console.log("Leaderboard data prepared:", leaderboardData.length);

    return NextResponse.json(leaderboardData, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
