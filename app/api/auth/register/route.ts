// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/user";
import { hash } from "bcryptjs";
import { randomUUID } from "crypto";
import { ApiResponse } from "@/types/api";

export async function POST(req: Request) {
  try {
    await connectDB();
    console.log("Connected to database");

    const { name, email, department, section, password } = await req.json();

    if (!name || !email || !department || !section || !password) {
      return NextResponse.json<ApiResponse<never>>({ 
        error: "All fields are required" 
      }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json<ApiResponse<never>>({ 
        error: "User already exists" 
      }, { status: 400 });
    }

    const hashedPassword = await hash(password, 12);
    const referralCode = `IGBC${randomUUID().split("-")[0]}`;

    const user = new User({
      name,
      email,
      department,
      section,
      password: hashedPassword,
      referralCode,
    });

    await user.save();
    console.log("User created successfully");

    return NextResponse.json<ApiResponse<never>>({ 
      message: "User created successfully" 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json<ApiResponse<never>>({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
