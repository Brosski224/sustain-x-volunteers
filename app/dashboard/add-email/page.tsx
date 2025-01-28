import { EmailForm } from "@/components/dashboard/email-form"

export default function AddEmail() {
  return (
    <main className="container mx-auto p-4">
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-2xl font-bold text-center">Add New Email</h1>
        <EmailForm />
      </div>
    </main>
  )
}

