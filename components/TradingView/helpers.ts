export type SymbolPair = {
  short: string;
  full: string;
};

export type FullSymbol = {
  exchange: string;
  fromSymbol: string;
  toSymbol: string;
};

export const makeApiRequest = async (path: string) => {
  try {
    const response = await fetch(`https://min-api.cryptocompare.com/${path}`);
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error(`CryptoCompare request error: ${error}`);
  }
};

export const generateSymbol = (
  exchange: string,
  fromSymbol: string,
  toSymbol: string,
): SymbolPair => {
  const short = `${fromSymbol}/${toSymbol}`;
  return {
    short,
    full: `${exchange}:${short}`,
  };
};

export const parseFullSymbol = (fullSymbol: string): FullSymbol | null => {
  const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
  if (!match) {
    return null;
  }

  return {
    exchange: "Bitfinex",
    fromSymbol: match[2],
    toSymbol: match[3],
  };
};
