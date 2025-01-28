import { cookies } from "next/headers"
import { jwtVerify } from "jose"
import { UserStats } from "@/components/dashboard/user-stats"
import { Leaderboard } from "@/components/dashboard/leaderboard"
import { User } from "@/lib/models/user"
import connectDB from "@/lib/db"

async function getUser() {
  const token = cookies().get("auth-token")
  if (!token) return null

  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
  const { payload } = await jwtVerify(token.value, secret)

  await connectDB()
  return User.findById(payload.userId)
}

async function getLeaderboardData() {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/leaderboard`;
  const res = await fetch(apiUrl, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch leaderboard");
  return res.json();
}
export default async function Dashboard() {
  const [user, leaderboardData] = await Promise.all([getUser(), getLeaderboardData()])

  if (!user) {
    return null
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <UserStats referralCode={user.referralCode} emailCount={user.emailCount} />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Leaderboard</h2>
        <Leaderboard data={leaderboardData} />
      </div>
    </main>
  )
}

