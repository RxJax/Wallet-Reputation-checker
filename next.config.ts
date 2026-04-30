import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    '@rainbow-me/rainbowkit',
    'wagmi',
    '@walletconnect/universal-provider',
    '@walletconnect/ethereum-provider'
  ],
  serverExternalPackages: [
    'pino-pretty',
    'lokijs',
    'encoding',
    '@react-native-async-storage/async-storage'
  ],
};

export default nextConfig;
