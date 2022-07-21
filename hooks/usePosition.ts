import { useMemo } from "react";
import {
  getMarketStatus,
  MarketStatusEnum,
  ParimutuelMarket,
  ParimutuelPosition,
} from "parimutuelsdk";

import { getWeb3Config } from "@constants/config";
import { useParimutuel } from "@contexts/parimutuel";
import { useMint } from "@hooks/useMint";
import { getMarketByPubkey, getMarketPairByPubkey } from "@utils/utils";

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
  settlementTokenDecimals: number,
  settlementTokenContractSize: number,
): PositionItem => {
  const { info } = position;
  const market = getMarketByPubkey(info.parimutuel.marketKey, markets);
  const duration = market?.info.market.duration.toNumber() ?? 0;

  const poolSize =
    (info.parimutuel.activeLongPositions.toNumber() +
      info.parimutuel.activeShortPositions.toNumber()) /
    10 ** settlementTokenDecimals /
    settlementTokenContractSize;
  const poolLong =
    info.parimutuel.activeLongPositions.toNumber() /
    (10 ** settlementTokenDecimals / settlementTokenContractSize);
  const poolShort =
    info.parimutuel.activeShortPositions.toNumber() /
    (10 ** settlementTokenDecimals / settlementTokenContractSize);

  const positionLong =
    info.position.longPosition.toNumber() /
    (10 ** settlementTokenDecimals / settlementTokenContractSize);
  const positionShort =
    info.position.shortPosition.toNumber() /
    (10 ** settlementTokenDecimals / settlementTokenContractSize);

  const lockedPrice = info.parimutuel.strike.toNumber() / 10 ** 8;
  const settledPrice = info.parimutuel.index.toNumber() / 10 ** 8;

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
      poolSize,
      long: poolLong,
      short: poolShort,
    },
    position: {
      long: positionLong,
      short: positionShort,
    },
    locked: {
      price: lockedPrice,
    },
    settled: {
      price: settledPrice,
    },
  };
};

export const usePosition = () => {
  const { USDC_MINT } = getWeb3Config();
  const { positions, markets } = useParimutuel();

  const usdcMint = useMint(USDC_MINT);
  const usdcDecimals = useMemo(() => usdcMint?.decimals ?? 0, [usdcMint]);
  const contractSize = useMemo(() => markets[0]?.info.market.contractSize.toNumber(), [markets]);

  const parsedPositions = useMemo(
    () =>
      positions
        .map((position) => parseMyPositions(position, markets, usdcDecimals, contractSize))
        .sort((a, b) => b.time.startTime - a.time.startTime),
    [positions, markets, usdcDecimals, contractSize],
  );

  return { positions: parsedPositions };
};
