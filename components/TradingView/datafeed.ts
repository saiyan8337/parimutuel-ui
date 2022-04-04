import Emitter from "@utils/event";
import _get from "lodash/get";

import { generateSymbol, makeApiRequest, parseFullSymbol } from "./helpers";

export type SymbolSetting = {
  symbol: string;
  fullName: string;
  description: string;
  exchange: string;
  type: string;
};

const lastBarsCache = new Map();

const configurationData = {
  supported_resolutions: ["1"],
  exchanges: [
    {
      value: "Bitfinex",
      name: "Bitfinex",
      desc: "Bitfinex",
    },
  ],
  symbols_types: [
    {
      name: "crypto",
      value: "crypto",
    },
  ],
};

const getAllSymbols = async () => {
  const data = await makeApiRequest("data/v3/all/exchanges");
  let allSymbols: SymbolSetting[] = [];

  for (const exchange of configurationData.exchanges) {
    const pairs = data.Data[exchange.value].pairs;

    for (const leftPairPart of Object.keys(pairs)) {
      const symbols = pairs[leftPairPart].map((rightPairPart: string) => {
        const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
        return {
          symbol: symbol.short,
          fullName: symbol.full,
          description: symbol.short,
          exchange: exchange.name,
          type: "crypto",
        } as SymbolSetting;
      });
      allSymbols = [...allSymbols, ...symbols];
    }
  }
  return allSymbols;
};

const DataFeed = {
  // eslint-disable-next-line
  onReady: (callback: any) => {
    setTimeout(() => callback(configurationData));
  },

  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: any, // eslint-disable-line
    onResolveErrorCallback: any, // eslint-disable-line
  ) => {
    const symbols = await getAllSymbols();
    const symbolItem = symbols.find(({ fullName }) => fullName === symbolName);
    if (!symbolItem) {
      onResolveErrorCallback("cannot resolve symbol");
      return;
    }
    const symbolInfo = {
      ticker: symbolItem.fullName,
      name: symbolItem.symbol,
      description: symbolItem.description,
      type: symbolItem.type,
      session: "24x7",
      timezone: "Etc/UTC",
      exchange: "Pyth",
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_no_volume: true,
      has_weekly_and_monthly: false,
      supported_resolutions: configurationData.supported_resolutions,
      volume_precision: 2,
      data_status: "streaming",
    };

    onSymbolResolvedCallback(symbolInfo);
  },

  getBars: async (
    symbolInfo: any, // eslint-disable-line
    resolution: any, // eslint-disable-line
    periodParams: any, // eslint-disable-line
    onHistoryCallback: any, // eslint-disable-line
    onErrorCallback: any, // eslint-disable-line
  ) => {
    const { from, to, firstDataRequest } = periodParams;

    const parsedSymbol = parseFullSymbol(symbolInfo.full_name); // eslint-disable-line
    if (!parsedSymbol) return;

    const urlParameters = {
      e: parsedSymbol.exchange,
      fsym: parsedSymbol.fromSymbol,
      tsym: parsedSymbol.toSymbol,
      toTs: to,
      limit: 2000,
    };
    const query = Object.keys(urlParameters)
      .map((name) => `${name}=${encodeURIComponent(_get(urlParameters, name))}`)
      .join("&");

    try {
      const data = await makeApiRequest(`data/histominute?${query}`);
      if ((data.Response && data.Response === "Error") || data.Data.length === 0) {
        // "noData" should be set if there is no data in the requested period.
        onHistoryCallback([], {
          noData: true,
        });
        return;
      }
      let bars: any = []; // eslint-disable-line
      // eslint-disable-next-line
      data.Data.forEach((bar: any) => {
        if (bar.time >= from && bar.time < to) {
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
            },
          ];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.full_name, {
          ...bars[bars.length - 1],
        });
      }
      onHistoryCallback(bars, {
        noData: false,
      });
    } catch (error) {
      onErrorCallback(error);
    }
  },

  // eslint-disable-next-line
  subscribeBars: (
    symbolInfo: any, // eslint-disable-line
    resolution: any, // eslint-disable-line
    onRealtimeCallback: any, // eslint-disable-line
  ) => {
    // eslint-disable-next-line
    Emitter.on("PYTH_UPDATE", (data: any) => {
      const bar = {
        time: new Date().getTime(),
        open: data.price,
        high: data.price,
        low: data.price,
        close: data.price,
      };
      onRealtimeCallback(bar);
    });
  },

  unsubscribeBars: (subscriberUID: string) => {
    console.log("[unsubscribeBars]: Method call with subscriberUID:", subscriberUID); // eslint-disable-line
  },
};

export default DataFeed;
