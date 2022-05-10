import { useMemo } from "react";
import {
  isParimutuelAccount,
  MarketPairEnum,
  ParimutuelAccount,
  ParimutuelMarket,
  ParimutuelPosition,
} from "parimutuel-web3";

import { useParimutuel } from "@contexts/parimutuel";
import { usePyth } from "@contexts/pyth";
import { getMarketByPubkey, getMarketPairByPubkey } from "@utils/utils";

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
  decimal: number,
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
      poolSize: (activeLongPositions.toNumber() + activeShortPositions.toNumber()) / 100,
      long: activeLongPositions.toNumber() / 100,
      short: activeShortPositions.toNumber() / 100,
    },
    position: {
      long: longPosition / 100,
      short: shortPosition / 100,
    },
    locked: {
      price: strike.toNumber() / 10 ** decimal,
    },
    settled: {
      price: index.toNumber() / 10 ** decimal,
    },
    payout: {
      longPosition: longPosition / 100,
      shortPosition: shortPosition / 100,
      longPool: activeLongPositions.toNumber() / 100,
      shortPool: activeShortPositions.toNumber() / 100,
      lockedPrice: strike.toNumber() / 10 ** decimal,
      settledPrice: index.toNumber() / 10 ** decimal,
      parimutuelPubkey: parimutuelAccount.pubkey.toBase58(),
      marketPubkey: parimutuel.marketKey,
      isExpired: !!expired,
    },
  };
};

export const useMarket = () => {
  const { priceMap } = usePyth();
  const { positions, markets, parimutuels } = useParimutuel();

  const usdDecimal = useMemo(() => {
    const price = priceMap[MarketPairEnum.SOLUSD];
    return Math.abs(price?.priceData.exponent) ?? 0;
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
          const data = parseMarket(account, markets, positions, usdDecimal);
          return data;
        })
        .sort((a, b) => a.time.startTime - b.time.startTime),
    [parimutuels, markets, positions, usdDecimal],
  );

  const upcomingParimutuels = useMemo(
    () =>
      parimutuels
        .filter((account) => isParimutuelAccount(account.account))
        .filter(
          (account) => account.info.parimutuel.timeWindowStart.toNumber() > new Date().getTime(),
        )
        .map((account) => {
          const data = parseMarket(account, markets, positions, usdDecimal);
          return data;
        })
        .sort((a, b) => a.time.startTime - b.time.startTime),
    [parimutuels, markets, positions, usdDecimal],
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
          const data = parseMarket(account, markets, positions, usdDecimal);
          return data;
        })
        .sort((a, b) => a.time.startTime - b.time.startTime),
    [parimutuels, markets, positions, usdDecimal],
  );

  return { settledParimutuels, upcomingParimutuels, liveParimutuels };
};
