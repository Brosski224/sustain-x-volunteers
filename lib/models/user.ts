import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    section: {
      type: String,
      required: true,
      enum: ["Sponsorship", "Outreach", "Curation", "Event", "Ambience"],
    },
    password: { type: String, required: true },
    referralCode: { type: String, unique: true },
    emailCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)

