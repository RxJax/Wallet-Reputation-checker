import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    'wagmi',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider'
  ],
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding', '@react-native-async-storage/async-storage');
    return config;
  },
};

export default nextConfig;
