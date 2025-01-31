import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";
import { Button } from "@/components/ui/button";

const messages = [
  "Please remember your password. We're really not kidding, there is no password recovery option :)",
  "Make sure to write down your password somewhere safe. We cannot recover it for you.",
  "Don't forget your password! There is no way to reset it if you lose it.",
  "You've got this! Just remember your password and you're all set. Hehe no recovery option here.",
  "Keep your password safe! We can't help you recover it if you lose it.",
  "You've been warned! forget your password and you're doomed forever.",
  "Apparently, we're old school; remember your password, because there's no recovery option.",
];

function getRandomMessage() {
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function Register() {
  const message = getRandomMessage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground">Create your account</p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          {message}
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
