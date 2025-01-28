"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UserStatsProps {
  referralCode: string
  emailCount: number
}

export function UserStats({ referralCode, emailCount }: UserStatsProps) {
  const router = useRouter()

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Referral Code</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{referralCode}</p>
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
  )
}

