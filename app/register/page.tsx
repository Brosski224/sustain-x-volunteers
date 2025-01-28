import Link from "next/link"
import { RegisterForm } from "@/components/auth/register-form"
import { Button } from "@/components/ui/button"

export default function Register() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">SustainX Volunteers</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/">
            <Button variant="link" className="p-0">
              Login here
            </Button>
          </Link>
        </p>
      </div>
    </main>
  )
}

