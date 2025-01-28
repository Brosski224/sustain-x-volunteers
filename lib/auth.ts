import { hash, compare } from "bcryptjs"
import { User } from "./models/user"

export async function hashPassword(password: string) {
  return await hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await compare(password, hashedPassword)
}

export function generateReferralCode() {
  const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `IGBC${randomString}`
}

