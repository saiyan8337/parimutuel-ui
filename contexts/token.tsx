import React, { useContext, useEffect, useState } from "react";
import { ENV, TokenInfo, TokenListProvider } from "@solana/spl-token-registry";

export type KnownTokenMap = Map<string, TokenInfo>;
interface TokenContextProps {
  tokens: TokenInfo[];
  tokenMap: Map<string, TokenInfo>;
}

const defaultContext: TokenContextProps = {
  tokens: [],
  tokenMap: new Map(),
};

export const TokenContext = React.createContext<TokenContextProps>(defaultContext);

export const TokenProvider: React.FC = ({ children }) => {
  const [tokens, setTokens] = useState<TokenInfo[]>([]);
  const [tokenMap, setTokenMap] = useState<KnownTokenMap>(new Map());

  useEffect(() => {
    // fetch token files
    new TokenListProvider().resolve().then((container) => {
      // TODO: make env dynamic
      const list = container.excludeByTag("nft").filterByChainId(ENV.Devnet).getList();

      const knownMints = [...list].reduce((map, item) => {
        map.set(item.address, item);
        return map;
      }, new Map<string, TokenInfo>());

      setTokenMap(knownMints);
      setTokens(list);
    });
  }, []);

  return (
    <TokenContext.Provider
      value={{
        tokens,
        tokenMap,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
};

export function useToken() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error("useToken must be used within a TokenProvider");
  }
  return context;
}
