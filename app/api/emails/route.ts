import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import connectDB from "@/lib/db";
import { Email } from "@/lib/models/email";
import { User } from "@/lib/models/user";

export async function POST(req: Request) {
  try {
    // Get the auth token from cookies
    const token = req.cookies.get("auth-token");
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the token to get the user payload
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const { payload } = await jwtVerify(token.value, secret);

    // Parse the incoming request body
    const { emails } = await req.json();

    // Ensure emails is an array
    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ error: "No emails provided" }, { status: 400 });
    }

    await connectDB();
    console.log("Connected to database");

    // Create an array to track the results for each email
    const addedEmails = [];
    const duplicateEmails = [];

    // Process each email
    for (let email of emails) {
      // Trim spaces and ensure the email is valid
      email = email.trim();
      if (!email) continue; // Skip empty emails

      // Check for duplicate email
      const existingEmail = await Email.findOne({ email });
      if (existingEmail) {
        duplicateEmails.push(email); // Track duplicates
        continue;
      }

      // Create a new email entry
      await Email.create({
        email,
        submittedBy: payload.userId,
      });
      addedEmails.push(email); // Track successfully added emails
    }

    // Update the user's email count based on the added emails
    if (addedEmails.length > 0) {
      const user = await User.findByIdAndUpdate(
        payload.userId,
        { $inc: { emailCount: addedEmails.length } },
        { new: true }
      );

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      console.log("Email count updated for user:", user.name);
    }

    // Log results and respond with success
    console.log("Email(s) added successfully:", addedEmails);

    return NextResponse.json({
      message: "Emails added successfully",
      addedEmails,
      duplicateEmails,
    });
  } catch (error) {
    console.error("Email submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
