/** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination:
//           "https://ssrreactflowf9455-n7cidehgba-uc.a.run.app/api/graphql",
//       },
//     ];
//   },
// };

module.exports = {
  // ...nextConfig,
  webpack: (config) => {
    config.experiments = { topLevelAwait: true, layers: true };
    return config;
  },
};
