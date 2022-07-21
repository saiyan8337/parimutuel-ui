import { useMemo } from "react";
import {
  isParimutuelAccount,
  MarketPairEnum,
  ParimutuelAccount,
  ParimutuelMarket,
  ParimutuelPosition,
} from "@hxronetwork/parimutuelsdk";

import { getWeb3Config } from "@constants/config";
import { useParimutuel } from "@contexts/parimutuel";
import { usePyth } from "@contexts/pyth";
import { getMarketByPubkey, getMarketPairByPubkey } from "@utils/utils";

import { useMint } from "./useMint";

export type MarketBoardItem = {
  key: { parimutuelPubkey: string; marketPubkey: string };
  market: {
    marketPair: string;
    duration: number;
  };
  time: { startTime: number; endTime: number };
  pool: { poolSize: number; long: number; short: number };
  position: { long: number; short: number };
  locked: { price: number };
  settled: { price: number };
  payout: {
    longPool: number;
    shortPool: number;
    longPosition: number;
    shortPosition: number;
    lockedPrice: number;
    settledPrice: number;
    parimutuelPubkey: string;
    marketPubkey: string;
    isExpired: boolean;
  };
};

export const parseMarket = (
  parimutuelAccount: ParimutuelAccount,
  markets: ParimutuelMarket[],
  positions: ParimutuelPosition[],
  pythUsdDecimal: number,
  usdDecimal: number,
  contractSize: number,
): MarketBoardItem => {
  const { parimutuel } = parimutuelAccount.info;
  const market = getMarketByPubkey(parimutuel.marketKey, markets);
  const foundPosition = positions.find(
    (position) => position.info.parimutuelPubkey.toBase58() === parimutuelAccount.pubkey.toBase58(),
  );

  const { timeWindowStart, activeLongPositions, activeShortPositions, strike, index, expired } =
    parimutuel;

  const duration = market?.info.market.duration.toNumber() ?? 0;
  const longPosition = foundPosition?.info.position?.longPosition.toNumber() ?? 0;
  const shortPosition = foundPosition?.info.position?.shortPosition.toNumber() ?? 0;

  const decimalDivider = 10 ** usdDecimal / contractSize;

  return {
    key: {
      parimutuelPubkey: parimutuelAccount.pubkey.toBase58(),
      marketPubkey: parimutuel.marketKey,
    },
    market: {
      marketPair: getMarketPairByPubkey(parimutuel.marketKey),
      duration,
    },
    time: {
      startTime: timeWindowStart.toNumber(),
      endTime: timeWindowStart.toNumber() + duration * 1000,
    },
    pool: {
      poolSize: (activeLongPositions.toNumber() + activeShortPositions.toNumber()) / decimalDivider,
      long: activeLongPositions.toNumber() / decimalDivider,
      short: activeShortPositions.toNumber() / decimalDivider,
    },
    position: {
      long: longPosition / decimalDivider,
      short: shortPosition / decimalDivider,
    },
    locked: {
      price: strike.toNumber() / 10 ** pythUsdDecimal,
    },
    settled: {
      price: index.toNumber() / 10 ** pythUsdDecimal,
    },
    payout: {
      longPosition: longPosition / decimalDivider,
      shortPosition: shortPosition / decimalDivider,
      longPool: activeLongPositions.toNumber() / decimalDivider,
      shortPool: activeShortPositions.toNumber() / decimalDivider,
      lockedPrice: strike.toNumber() / 10 ** pythUsdDecimal,
      settledPrice: index.toNumber() / 10 ** pythUsdDecimal,
      parimutuelPubkey: parimutuelAccount.pubkey.toBase58(),
      marketPubkey: parimutuel.marketKey,
      isExpired: !!expired,
    },
  };
};

export const useMarket = () => {
  const { priceMap } = usePyth();
  const { positions, markets, parimutuels } = useParimutuel();
  const { USDC_MINT } = getWeb3Config();
  const usdcAddress = USDC_MINT.toString();

  const usdcMint = useMint(usdcAddress);
  const usdDecimal = useMemo(() => usdcMint?.decimals ?? 0, [usdcMint]);

  const contractSize = useMemo(() => markets[0]?.info.market.contractSize.toNumber(), [markets]);

  const pythUsdDecimal = useMemo(() => {
    const price = priceMap[MarketPairEnum.SOLUSD];
    return Math.abs(price?.priceData.exponent) ?? 8;
  }, [priceMap]);

  const settledParimutuels = useMemo(
    () =>
      parimutuels
        .filter((account) => isParimutuelAccount(account.account))
        .filter((account) => {
          const { parimutuel } = account.info;
          const market = getMarketByPubkey(parimutuel.marketKey, markets);
          const duration = market?.info.market.duration.toNumber() ?? 0;
          return new Date().getTime() > parimutuel.timeWindowStart.toNumber() + duration * 1000;
        })
        .map((account) => {
          const data = parseMarket(
            account,
            markets,
            positions,
            pythUsdDecimal,
            usdDecimal,
            contractSize,
          );
          return data;
        })
        .sort((a, b) => a.time.startTime - b.time.startTime),
    [parimutuels, markets, positions, pythUsdDecimal, usdDecimal, contractSize],
  );

  const upcomingParimutuels = useMemo(
    () =>
      parimutuels
        .filter((account) => isParimutuelAccount(account.account))
        .filter(
          (account) => account.info.parimutuel.timeWindowStart.toNumber() > new Date().getTime(),
        )
        .map((account) => {
          const data = parseMarket(
            account,
            markets,
            positions,
            pythUsdDecimal,
            usdDecimal,
            contractSize,
          );
          return data;
        })
        .sort((a, b) => a.time.startTime - b.time.startTime),
    [parimutuels, markets, positions, pythUsdDecimal, usdDecimal, contractSize],
  );

  const liveParimutuels = useMemo(
    () =>
      parimutuels
        .filter((account) => isParimutuelAccount(account.account))
        .filter((account) => {
          const { parimutuel } = account.info;
          const market = getMarketByPubkey(parimutuel.marketKey, markets);
          const duration = market?.info.market.duration.toNumber() ?? 0;
          const currentTime = new Date().getTime();
          return (
            currentTime > parimutuel.timeWindowStart.toNumber() &&
            currentTime < parimutuel.timeWindowStart.toNumber() + duration * 1000
          );
        })
        .map((account) => {
          const data = parseMarket(
            account,
            markets,
            positions,
            pythUsdDecimal,
            usdDecimal,
            contractSize,
          );
          return data;
        })
        .sort((a, b) => a.time.startTime - b.time.startTime),
    [parimutuels, markets, positions, pythUsdDecimal, usdDecimal, contractSize],
  );

  return { settledParimutuels, upcomingParimutuels, liveParimutuels };
};
