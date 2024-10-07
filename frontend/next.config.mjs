/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.dictionary.com",
        pathname: "/e/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
