import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">SustainX</h1>
          <p className="text-muted-foreground">Login to access your dashboard</p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register">
            <Button variant="link" className="p-0">
              Register here
            </Button>
          </Link>
        </p>
        <div className="text-center">
          <Link href="/leaderboard">
            <Button variant="primary">Show Leaderboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}