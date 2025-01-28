// types/api.ts
export type ApiResponse<T> = {
  data?: T;
  error?: string;
  message?: string;
};

export type LeaderboardEntry = {
  userId: string;
  section: string;
  points: number;
};

// app/api/register/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/user";
import { Leaderboard } from "@/lib/models/leaderboard";
import { hashPassword, generateReferralCode } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const { name, email, department, section, password } = await req.json();
    
    // Validate required fields
    if (!name || !email || !department || !section || !password) {
      return NextResponse.json<ApiResponse<never>>({ 
        error: "All fields are required" 
      }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json<ApiResponse<never>>({ 
        error: "Email already exists" 
      }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const referralCode = generateReferralCode();

    const session = await User.startSession();
    try {
      await session.startTransaction();

      const user = await User.create([{
        name,
        email,
        department,
        section,
        password: hashedPassword,
        referralCode,
      }], { session });

      await Leaderboard.create([{
        userId: user[0]._id,
        section,
        points: 0,
      }], { session });

      await session.commitTransaction();
      return NextResponse.json<ApiResponse<never>>({ 
        message: "User created successfully" 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<ApiResponse<never>>({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}

// app/dashboard/page.tsx
import { LeaderboardEntry, ApiResponse } from "@/types/api";

async function getLeaderboardData(): Promise<LeaderboardEntry[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/leaderboard`, {
    cache: "no-store",
  });

  const data: ApiResponse<LeaderboardEntry[]> = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to fetch leaderboard");
  }

  return data.data || [];
}

export default async function Dashboard() {
  try {
    const leaderboardData = await getLeaderboardData();
    
    return (
      <div>
        {/* Render your leaderboard data */}
        {leaderboardData.map((entry) => (
          <div key={entry.userId}>
            {/* Render entry details */}
          </div>
        ))}
      </div>
    );
  } catch (error) {
    // You can either render an error component or redirect to an error page
    return (
      <div className="p-4 text-red-600">
        <h2 className="text-lg font-semibold">Error Loading Dashboard</h2>
        <p>Unable to load leaderboard data. Please try again later.</p>
      </div>
    );
  }
}