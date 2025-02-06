"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function EmailForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  // Add emails to the list when user submits or presses Enter
  const handleAddEmails = () => {
    const newEmails = emailInput.split(",").map((email) => email.trim()).filter((email) => email);
    if (newEmails.length === 0) {
      setError("Please enter at least one valid email.");
      return;
    }
    setEmails([...emails, ...newEmails]);
    setEmailInput(""); // Clear the input after adding
    setError(""); // Clear error message
  };

  // Handle form submission
  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emails }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit emails");
      }

      // Reset form and refresh the page after success
      setEmails([]);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Emails</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-input">Enter Emails (separate with commas)</Label>
              <Input
                id="email-input"
                name="email-input"
                type="text"
                value={emailInput}
                onChange={handleInputChange}
                placeholder="Enter emails here"
              />
            </div>
            <Button type="button" onClick={handleAddEmails} variant="outline" className="text-blue-500">
              Add Emails
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            <div className="space-y-2 mt-4">
              <h3 className="font-bold">Emails to Submit:</h3>
              <ul className="list-disc pl-5">
                {emails.map((email, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    {email}
                  </li>
                ))}
              </ul>
            </div>
            <Button type="submit" disabled={isLoading || emails.length === 0}>
              {isLoading ? "Submitting..." : "Submit Emails"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
