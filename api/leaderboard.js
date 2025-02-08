import { getLeaderboardData } from '../../lib/leaderboard';

export default async function handler(req, res) {
  // Ensure the method is GET
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const data = await getLeaderboardData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load leaderboard data' });
  }
}
