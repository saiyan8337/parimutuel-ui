import getConfig from "next/config";
import { ConfigEnum, DEV_CONFIG, ParimutuelConfig, STAGING_CONFIG } from "parimutuel-web3";

export const getWeb3Config = (config?: ParimutuelConfig) => {
  const {
    publicRuntimeConfig: { APP_ENV },
  } = getConfig();

  if (APP_ENV === ConfigEnum.DEV) return DEV_CONFIG;
  if (APP_ENV === ConfigEnum.STAGING) return STAGING_CONFIG;
  return config as ParimutuelConfig;
};

export const getWeb3Url = () => {
  const {
    publicRuntimeConfig: { APP_ENV },
  } = getConfig();

  if (APP_ENV === ConfigEnum.STAGING)
    return "https://hxro.rpcpool.com/081597d8bb90b3da7fd354257950";
  return "https://api.devnet.rpcpool.com/081597d8bb90b3da7fd354257950";
};
