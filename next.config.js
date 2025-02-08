/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ...existing redirects...
      // Ensure there are no redirects affecting /api/leaderboard
    ];
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  // ...existing config...
};

module.exports = nextConfig;
