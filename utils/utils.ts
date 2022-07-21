import { CryptoEnum, getMarketPubkeys, MarketPairEnum, ParimutuelMarket } from "parimutuelsdk";
import { PublicKey } from "@solana/web3.js";

import { getWeb3Config } from "@constants/config";
import { TOKEN_LIST } from "@constants/tokens";
import { KnownTokenMap } from "@contexts/token";
import hxroSvg from "@public/images/hxro.svg";
import solonaSvg from "@public/images/solona.svg";
import usdcSvg from "@public/images/usdc.svg";

export const notEmpty = <T>(value: T): value is NonNullable<typeof value> => !!value;

export enum PositionSummaryOptionEnum {
  ALL = "all",
  LIVE = "live",
  UPCOMING = "upcoming",
}

export const getCryptoAddress = (crypto: string): string => {
  return TOKEN_LIST[crypto];
};

export const getMarketByPubkey = (
  marketPubkey: string,
  markets: ParimutuelMarket[],
): ParimutuelMarket | undefined => {
  return markets.find((market) => market.pubkey.toBase58() === marketPubkey);
};

export const getMarketPairByPubkey = (marketKey: string): string => {
  const config = getWeb3Config();
  const solMarkets = getMarketPubkeys(config, MarketPairEnum.SOLUSD);
  const solMarket = solMarkets.find((market) => market.pubkey.toBase58() === marketKey);
  if (solMarket) return MarketPairEnum.SOLUSD;

  const btcMarkets = getMarketPubkeys(config, MarketPairEnum.BTCUSD);
  const btcMarket = btcMarkets.find((market) => market.pubkey.toBase58() === marketKey);
  if (btcMarket) return MarketPairEnum.BTCUSD;

  return MarketPairEnum.ETHUSD;
};

export const getCryptoName = (crypto: CryptoEnum): string => {
  switch (crypto) {
    case CryptoEnum.SOLANA:
      return "Solana";
    case CryptoEnum.USDC:
      return "USDC Coin";
    case CryptoEnum.HXRO:
      return "HXRO";
  }
};

export const formatMarketPair = (pair: MarketPairEnum): string => {
  const fiatSymbol = pair.slice(-3);
  const cryptoSymbol = pair.slice(0, -3);
  return cryptoSymbol + "/" + fiatSymbol;
};

export const getCryptoAbbr = (crypto: CryptoEnum): string => {
  switch (crypto) {
    case CryptoEnum.SOLANA:
      return "SOL";
    case CryptoEnum.USDC:
      return "USDC";
    case CryptoEnum.HXRO:
      return "HXRO";
  }
};

export const getCryptoIcon = (crypto: CryptoEnum): string => {
  switch (crypto) {
    case CryptoEnum.SOLANA:
      return solonaSvg;
    case CryptoEnum.USDC:
      return usdcSvg;
    case CryptoEnum.HXRO:
      return hxroSvg;
  }
};

// TODO: use this method for get icon
export const getTokenIcon = (
  map: KnownTokenMap,
  mintAddress?: string | PublicKey,
): string | undefined => {
  const address = typeof mintAddress === "string" ? mintAddress : mintAddress?.toBase58();
  if (!address) {
    return;
  }

  return map.get(address)?.logoURI;
};
