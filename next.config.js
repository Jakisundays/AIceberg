/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["fwrxlylgwpfyowgxzyta.supabase.co"],
  },
  webpack: (config) => {
    config.externals = [...config.externals, "hnswlib-node"];

    return config;
  },
};

module.exports = nextConfig;
