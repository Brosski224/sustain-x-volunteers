import { NextApiRequest, NextApiResponse } from "next";
import connectDB from "@/lib/db";
import { Leaderboard } from "@/lib/models/leaderboard";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const leaderboardData = await Leaderboard.find().sort({ score: -1 }).limit(10);
    res.status(200).json(leaderboardData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard data" });
  }
}
