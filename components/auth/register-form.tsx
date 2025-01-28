import { NextApiRequest, NextApiResponse } from "next"
import { hash } from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import connectToDatabase from "@/lib/db"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { name, email, department, section, password } = req.body

  if (!name || !email || !department || !section || !password) {
    return res.status(400).json({ error: "All fields are required" })
  }

  const client = await connectToDatabase()
  const User = client.model("User")

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" })
  }

  const hashedPassword = await hash(password, 12)
  const referralCode = `IGBC${uuidv4().split("-")[0]}`

  const user = new User({
    name,
    email,
    department,
    section,
    password: hashedPassword,
    referralCode,
  })

  await user.save()

  res.status(201).json({ message: "User created successfully" })
}