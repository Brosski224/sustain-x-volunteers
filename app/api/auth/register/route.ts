import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/user"
import { Leaderboard } from "@/lib/models/leaderboard"
import { hashPassword, generateReferralCode } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { name, email, department, section, password } = await req.json()

    await connectDB()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const referralCode = generateReferralCode()

    const user = await User.create({
      name,
      email,
      department,
      section,
      password: hashedPassword,
      referralCode,
    })

    // Create initial leaderboard entry
    await Leaderboard.create({
      userId: user._id,
      section,
      points: 0,
    })

    return NextResponse.json({ message: "User created successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

