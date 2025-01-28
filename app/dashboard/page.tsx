import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { UserStats } from "@/components/dashboard/user-stats";
import { User } from "@/lib/models/user";
// import { connectDB } from "@/lib/models/user";

async function getUser() {
  const token = cookies().get("auth-token");
  if (!token || !token.value) return null;

  const secret = process.env.NEXTAUTH_SECRET
    ? new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
    : (() => {
        throw new Error("NEXTAUTH_SECRET is not defined");
      })();

  const { payload } = await jwtVerify(token.value, secret);

  await connectDB();
  return User.findById(payload.userId);
}



export default async function Dashboard() {
  const [user] = await Promise.all([getUser()]);

  if (!user) {
    return (
      <main className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold">Unauthorized</h1>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <UserStats referralCode={user.referralCode} emailCount={user.emailCount} />
      </div>

    </main>
  );
}
import mongoose from "mongoose";

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }

  return mongoose.connect(mongoUri);
}

