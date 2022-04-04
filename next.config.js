/* eslint-disable @typescript-eslint/no-var-requires */
const withPlugins = require("next-compose-plugins");

/* eslint-disable @typescript-eslint/no-var-requires */
const image = require("next-images");

/* eslint-disable @typescript-eslint/no-var-requires */
const transpile = require("next-transpile-modules")([
  "@project-serum/sol-wallet-adapter",
  "@solana/wallet-adapter-base",
  "@solana/wallet-adapter-react",
  "@solana/wallet-adapter-wallets",
  "@solana/wallet-adapter-ledger",
  "@solana/wallet-adapter-mathwallet",
  "@solana/wallet-adapter-phantom",
  "@solana/wallet-adapter-solflare",
  "@solana/wallet-adapter-sollet",
  "@solana/wallet-adapter-solong",
  "@solana/wallet-adapter-torus",
]);

const plugins = [
  [
    transpile,
    {
      webpack5: true,
      reactStrictMode: true,
    },
  ],
  image,
];

const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3)$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[path][name].[hash][ext]",
      },
    });

    return config;
  },
  serverRuntimeConfig: {
    AUTHORITY_KEY_PAIR: process.env.AUTHORITY_KEY_PAIR,
    GOOGLE_SERVICE_ACCOUNT_EMAIL: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY,
    GOOGLE_WHITELIST_SHEET_ID: process.env.GOOGLE_WHITELIST_SHEET_ID,
    GOOGLE_BLACKLIST_SHEET_ID: process.env.GOOGLE_BLACKLIST_SHEET_ID,
    IP_STACK_API_KEY: process.env.IP_STACK_API_KEY,
    GEO_BLOCKING: process.env.GEO_BLOCKING !== "false"
  },
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV,
    PYTH_ORACLE: process.env.PYTH_ORACLE,
  }
};

module.exports = withPlugins(plugins, nextConfig);
