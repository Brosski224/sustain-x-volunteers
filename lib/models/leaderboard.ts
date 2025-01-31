import mongoose from "mongoose";

const LeaderboardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true },
});

export const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", LeaderboardSchema);
