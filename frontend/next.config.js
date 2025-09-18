/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5000/api/:path*',
      },
    ];
  },
  images: {
    domains: [
      'www.lakkadinternational.pro',
      'market99.com',
      // add other domains as needed
    ],
  },
};

module.exports = nextConfig; 