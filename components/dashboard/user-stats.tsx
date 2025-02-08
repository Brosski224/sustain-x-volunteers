"use client"; // Add this line to mark the component as a client component

interface UserStatsProps {
  emailCount?: number;
  referralCode?: string; // ✅ Added referralCode
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation"; // ✅ Correct

export function UserStats({ emailCount = 0, referralCode }: UserStatsProps) {
  const router = useRouter();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Join as Campus Ambassador</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("https://sustainx.vercel.app/")}>
            Join Now
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Emails Submitted</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{emailCount}</p>
        </CardContent>
      </Card>
      
    </div>
  );
}
