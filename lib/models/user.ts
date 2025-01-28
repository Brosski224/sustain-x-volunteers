import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    department: { type: String, required: true },
    section: { type: String, required: true },
    password: { type: String, required: true },
    referralCode: { type: String, required: true },
    emailCount: { type: Number, default: 0 },
    ticketSold: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  },
)

export const User = mongoose.models.User || mongoose.model("User", userSchema)

