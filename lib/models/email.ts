import mongoose from "mongoose"

const emailSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  },
)

export const Email = mongoose.models.Email || mongoose.model("Email", emailSchema)

