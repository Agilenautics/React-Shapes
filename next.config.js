/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { topLevelAwait: true };
    // this will just update topLevelAwait property of config.experiments
    config.experiments.topLevelAwait = true;
    config.experiments.layers = true;
    return config;
  },
};
