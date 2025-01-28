import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { Leaderboard } from "@/lib/models/leaderboard"
import { User } from "@/lib/models/user"

export async function GET(req: Request) {
  try {
    await connectDB()

    const leaderboardData = await Leaderboard.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $group: {
          _id: "$section",
          entries: {
            $push: {
              name: "$user.name",
              department: "$user.department",
              points: "$points",
            },
          },
        },
      },
    ])

    const formattedData = leaderboardData.reduce(
      (acc, { _id, entries }) => {
        acc[_id] = entries.sort((a, b) => b.points - a.points)
        return acc
      },
      {} as Record<string, any>,
    )

    return NextResponse.json(formattedData)
  } catch (error) {
    console.error("Leaderboard error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

