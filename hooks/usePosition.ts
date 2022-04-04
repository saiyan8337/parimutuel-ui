import { useMemo } from "react";

import { useParimutuel } from "@contexts/parimutuel";
import { getMarketByPubkey, getMarketPairByPubkey } from "@utils/utils";
import {
  getMarketStatus,
  MarketStatusEnum,
  ParimutuelMarket,
  ParimutuelPosition,
} from "parimutuel-web3";

export type PositionItem = {
  key: {
    parimutuelPubkey: string;
  };
  market: { marketPair: string; status: MarketStatusEnum; duration: number; isExpired: boolean };
  time: { startTime: number };
  pool: { poolSize: number; long: number; short: number };
  position: { long: number; short: number };
  locked: { price: number };
  settled: { price: number };
};

export const parseMyPositions = (
  position: ParimutuelPosition,
  markets: ParimutuelMarket[],
): PositionItem => {
  const { info } = position;
  const market = getMarketByPubkey(info.parimutuel.marketKey, markets);
  const duration = market?.info.market.duration.toNumber() ?? 0;

  const marketStatus = getMarketStatus(
    info.parimutuel.marketClose.toString(),
    info.parimutuel.timeWindowStart.toString(),
    duration,
  );

  return {
    key: {
      parimutuelPubkey: info.parimutuelPubkey.toBase58(),
    },
    market: {
      marketPair: getMarketPairByPubkey(info.parimutuel.marketKey),
      duration,
      status: marketStatus,
      isExpired: !!info.parimutuel.expired,
    },
    time: {
      startTime: info.parimutuel.marketClose.toNumber(),
    },
    pool: {
      poolSize:
        (info.parimutuel.activeLongPositions.toNumber() +
          info.parimutuel.activeShortPositions.toNumber()) /
        100,
      long: info.parimutuel.activeLongPositions.toNumber() / 100,
      short: info.parimutuel.activeShortPositions.toNumber() / 100,
    },
    position: {
      long: info.position.longPosition.toNumber() / 100,
      short: info.position.shortPosition.toNumber() / 100,
    },
    locked: {
      price: info.parimutuel.strike.toNumber() / 10 ** 9,
    },
    settled: {
      price: info.parimutuel.index.toNumber() / 10 ** 9,
    },
  };
};

export const usePosition = () => {
  const { positions, markets } = useParimutuel();
  const parsedPositions = useMemo(
    () =>
      positions
        .map((position) => parseMyPositions(position, markets))
        .sort((a, b) => b.time.startTime - a.time.startTime),
    [positions, markets],
  );

  return { positions: parsedPositions };
};
