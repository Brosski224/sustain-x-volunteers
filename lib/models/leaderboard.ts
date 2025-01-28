import mongoose from "mongoose"

const leaderboardSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    points: { type: Number, default: 0 },
    section: {
      type: String,
      required: true,
      enum: ["Sponsorship", "Outreach", "Curation", "Event", "Ambience"],
    },
  },
  {
    timestamps: true,
  },
)

export const Leaderboard = mongoose.models.Leaderboard || mongoose.model("Leaderboard", leaderboardSchema)

