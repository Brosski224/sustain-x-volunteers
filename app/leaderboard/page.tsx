"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface LeaderboardEntry {
  name: string;
  department: string;
  section: string;
  emailCount: number;
  ticketSold: number;
  points: number;
  rank?: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResult, setShowSearchResult] = useState(false);

  useEffect(() => {
    async function fetchLeaderboardData() {
      try {
        const response = await fetch("/api/leaderboard");
        const data = await response.json();
        setLeaderboardData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
        setLoading(false);
      }
    }
    fetchLeaderboardData();
  }, []);

  const rankData = (data: LeaderboardEntry[], key: keyof LeaderboardEntry) => {
    return data
      .sort((a, b) => b[key] - a[key])
      .map((entry, index) => ({ ...entry, rank: index + 1 }));
  };

  const rankedEmailData = rankData([...leaderboardData], "emailCount");
  const rankedTicketData = rankData([...leaderboardData], "ticketSold");
  const sections = ["Sponsorship", "Outreach", "Curation", "Event", "Ambience"];
  const rankedSectionData = sections.reduce((acc, section) => {
    acc[section] = rankData(
      leaderboardData.filter((entry) => entry.section === section),
      "points"
    );
    return acc;
  }, {} as Record<string, LeaderboardEntry[]>);

  const searchResults = useMemo(() => {
    if (!searchQuery) return [];

    const query = searchQuery.toLowerCase().trim();
    return leaderboardData.filter(
      (entry) =>
        entry.name.toLowerCase().includes(query) ||
        entry.department.toLowerCase().includes(query) ||
        entry.section.toLowerCase().includes(query)
    );
  }, [searchQuery, leaderboardData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchResult(true);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSearchResult(false);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="container mx-auto p-4 space-y-8">
      <div className="text-center mb-4">
        <Link href="/">
          <Button variant="link">Back to Home</Button>
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-center">Leaderboard</h1>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search by name, department, or section..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (!e.target.value) {
                setShowSearchResult(false);
              }
            }}
            className="flex-1"
          />
          <Button type="submit" disabled={!searchQuery}>
            <Search size={16} />
          </Button>
        </form>
      </div>

      {showSearchResult && (
        <div className="mb-6">
          {searchResults.length > 0 ? (
            <div className="space-y-4">
              {searchResults.slice(0, 3).map((result, index) => (
                <div key={result.name} className="p-4 bg-gray-100 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-semibold">Search Result {index + 1}:</h3>
                      <p className="text-sm font-medium mt-1">{result.name}</p>
                      <p className="text-xs text-gray-400">{result.department}</p>
                      <p className="text-xs text-gray-400">{result.section}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">
                        {result.emailCount > 0 ? `Emails: ${result.emailCount}` : ""}
                        {result.ticketSold > 0 ? `Tickets: ${result.ticketSold}` : ""}
                        {result.points > 0 ? `Points: ${result.points}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-400">No results found.</p>
            </div>
          )}
          <Button onClick={clearSearch} variant="ghost" className="mt-4">
            Clear Search
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Emails Added</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Rank</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Department</th>
                <th className="px-2 py-1 text-left">Section</th>
                <th className="px-2 py-1 text-left">Emails</th>
              </tr>
            </thead>
            <tbody>
              {rankedEmailData.map((entry) => (
                <tr key={entry.name}>
                  <td className="px-2 py-1">{entry.rank}</td>
                  <td className="px-2 py-1">{entry.name}</td>
                  <td className="px-2 py-1">{entry.department}</td>
                  <td className="px-2 py-1">{entry.section}</td>
                  <td className="px-2 py-1">{entry.emailCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tickets Sold</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="px-2 py-1 text-left">Rank</th>
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Department</th>
                <th className="px-2 py-1 text-left">Section</th>
                <th className="px-2 py-1 text-left">Tickets</th>
              </tr>
            </thead>
            <tbody>
              {rankedTicketData.map((entry) => (
                <tr key={entry.name}>
                  <td className="px-2 py-1">{entry.rank}</td>
                  <td className="px-2 py-1">{entry.name}</td>
                  <td className="px-2 py-1">{entry.department}</td>
                  <td className="px-2 py-1">{entry.section}</td>
                  <td className="px-2 py-1">{entry.ticketSold}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <Card key={section}>
          <CardHeader>
            <CardTitle>{section} Points</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full table-auto">
              <thead>
                <tr>
                  <th className="px-2 py-1 text-left">Rank</th>
                  <th className="px-2 py-1 text-left">Name</th>
                  <th className="px-2 py-1 text-left">Department</th>
                  <th className="px-2 py-1 text-left">Points</th>
                </tr>
              </thead>
              <tbody>
                {rankedSectionData[section].map((entry) => (
                  <tr key={entry.name}>
                    <td className="px-2 py-1">{entry.rank}</td>
                    <td className="px-2 py-1">{entry.name}</td>
                    <td className="px-2 py-1">{entry.department}</td>
                    <td className="px-2 py-1">{entry.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
