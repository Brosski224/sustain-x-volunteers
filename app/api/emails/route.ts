import { NextResponse } from "next/server"
import { jwtVerify } from "jose"
import connectDB from "@/lib/db"
import { Email } from "@/lib/models/email"
import { User } from "@/lib/models/user"

export async function POST(req: Request) {
  try {
    const token = req.cookies.get("auth-token")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    const { payload } = await jwtVerify(token.value, secret)
    const { email } = await req.json()

    await connectDB()

    // Check for duplicate email
    const existingEmail = await Email.findOne({ email })
    if (existingEmail) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    // Create new email entry
    await Email.create({
      email,
      submittedBy: payload.userId,
    })

    // Update user's email count
    await User.findByIdAndUpdate(payload.userId, { $inc: { emailCount: 1 } })

    return NextResponse.json({ message: "Email added successfully" })
  } catch (error) {
    console.error("Email submission error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

