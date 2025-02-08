import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SignJWT } from "jose";
import connectDB from "@/lib/db";
import { User } from "@/lib/models/user";
import { verifyPassword } from "@/lib/auth";

const secretKey = process.env.NEXTAUTH_SECRET;
if (!secretKey) {
  throw new Error("NEXTAUTH_SECRET is missing from environment variables.");
}

const secret = new TextEncoder().encode(secretKey);

export async function POST(req: Request) {
  try {
    console.log("🔵 Received login request");

    // Parse request body
    const { email, password } = await req.json();
    console.log("🟢 Parsed request body:", { email });

    // Connect to database
    await connectDB();
    console.log("🟢 Database connected");

    // Find user by email
    const user = await User.findOne({ email }).lean();
    
    // Ensure user is an object, not an array
    if (!user || Array.isArray(user)) {
      console.warn("🔴 User not found:", email);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("🟢 User found:", user?.email);

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      console.warn("🔴 Incorrect password for:", email);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    console.log("🟢 Password verification successful");

    // Generate JWT Token
    console.log("🟡 Creating JWT token...");
    let token;
    try {
      token = await new SignJWT({
        userId: user._id,
        email: user.email,
        name: user.name,
        section: user.section,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secret);
      console.log("🟢 JWT token created successfully");
    } catch (jwtError) {
      console.error("🔴 JWT Signing Error:", jwtError);
      return NextResponse.json({ error: "Token generation failed" }, { status: 500 });
    }

    // Set auth-token as a cookie
    cookies().set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    console.log("🟢 Auth token set in cookie");

    // Prepare response
    const responseData = {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        section: user.section,
        referralCode: user.referralCode,
      },
    };

    console.log("🟢 Sending response:", responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("🔴 Login error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
