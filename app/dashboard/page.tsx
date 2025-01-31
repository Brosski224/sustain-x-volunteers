import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { redirect } from "next/navigation";
import { UserStats } from "@/components/dashboard/user-stats";
import { EmailForm } from "@/components/dashboard/email-form";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { User } from "@/lib/models/user";
import connectDB from "@/lib/db";
import { UserModel } from "@/types/user";

async function getUser(): Promise<UserModel | null> {
  const token = cookies().get("auth-token");
  if (!token) return redirect("/login");

  try {
    const secret = process.env.NEXTAUTH_SECRET
      ? new TextEncoder().encode(process.env.NEXTAUTH_SECRET)
      : (() => {
          throw new Error("NEXTAUTH_SECRET is not defined");
        })();

    const { payload } = await jwtVerify(token.value, secret);

    await connectDB();
    return User.findById(payload.userId);
  } catch (error) {
    console.error("Auth error:", error);
    return redirect("/login");
  }
}

export default async function Dashboard() {
  const user = await getUser();

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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <LogoutButton />
        </div>
        <UserStats referralCode={user.referralCode} emailCount={user.emailCount} />
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-center">Add New Email</h2>
        <EmailForm />
      </div>

      {/* Remove the file upload section */}
    </main>
  );
}
