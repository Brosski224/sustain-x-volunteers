"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LeaderboardEntry {
  name: string;
  department: string;
  section: string;
  emailCount: number;
  ticketSold: number;
  points: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboardData() {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboardData(data);
      setLoading(false);
    }

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const sections = ["Sponsorship", "Outreach", "Curation", "Event", "Ambience"];

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="text-center mb-4">
        <Link href="/">
          <Button variant="primary">Back to Login</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center">Leaderboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Emails Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">Department</th>
                  <th className="px-2 py-1 text-left">Section</th>
                  <th className="px-2 py-1 text-left">Emails Added</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.name}>
                    <td className="px-2 py-1">{entry.name}</td>
                    <td className="px-2 py-1">{entry.department}</td>
                    <td className="px-2 py-1">{entry.section}</td>
                    <td className="px-2 py-1">{entry.emailCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">Department</th>
                  <th className="px-2 py-1 text-left">Section</th>
                  <th className="px-2 py-1 text-left">Tickets Sold</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry) => (
                  <tr key={entry.name}>
                    <td className="px-2 py-1">{entry.name}</td>
                    <td className="px-2 py-1">{entry.department}</td>
                    <td className="px-2 py-1">{entry.section}</td>
                    <td className="px-2 py-1">{entry.ticketSold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{section} Exclusive</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="px-2 py-1 text-left">Name</th>
                    <th className="px-2 py-1 text-left">Department</th>
                    <th className="px-2 py-1 text-left">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData
                    .filter((entry) => entry.section === section)
                    .map((entry) => (
                      <tr key={entry.name}>
                        <td className="px-2 py-1">{entry.name}</td>
                        <td className="px-2 py-1">{entry.department}</td>
                        <td className="px-2 py-1">{entry.points}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
