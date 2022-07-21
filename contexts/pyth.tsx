import React, { useCallback, useContext, useEffect, useState } from "react";
import getConfig from "next/config";
import { MarketPairEnum } from "parimutuelsdk";
import { useConnection } from "@solana/wallet-adapter-react";
import { AccountInfo, PublicKey } from "@solana/web3.js";

import { useSetting } from "@contexts/setting";
import {
  parseMappingData,
  parsePriceData,
  parseProductData,
  PriceData,
  Product,
} from "@pythnetwork/client";
import Emitter from "@utils/event";

const SUPPORTED_CRYPTO: string[] = [
  MarketPairEnum.BTCUSD,
  MarketPairEnum.ETHUSD,
  MarketPairEnum.SOLUSD,
  MarketPairEnum.HXROUSD,
];

interface PriceMap {
  [pair: string]: { product: Product; priceData: PriceData };
}

type PythContextProps = {
  priceMap: PriceMap;
};

const defaultContext: PythContextProps = {
  priceMap: {},
};

export const PythContext = React.createContext<PythContextProps>(defaultContext);

export const PythProvider: React.FC = ({ children }) => {
  const {
    publicRuntimeConfig: { PYTH_ORACLE },
  } = getConfig();
  const { connection } = useConnection();
  const { selectedMarketPair } = useSetting();
  const [priceMap, setPriceMap] = useState<PriceMap>(defaultContext.priceMap);

  const ORACLE_PUBLIC_KEY = new PublicKey(PYTH_ORACLE);

  const updatePrice =
    (symbol: string, product: Product, priceData: PriceData) => (prev: PriceMap) => {
      if (
        !prev[symbol] ||
        prev[symbol].priceData.aggregate.publishSlot < priceData.aggregate.publishSlot
      ) {
        return {
          ...prev,
          [symbol]: {
            product,
            priceData,
          },
        };
      }

      return prev;
    };

  const handlePriceInfo = useCallback(
    (symbol: string, product: Product, accountInfo: AccountInfo<Buffer> | null) => {
      if (!accountInfo || !accountInfo.data) return;

      const priceData = parsePriceData(accountInfo.data);
      if (priceData.priceType !== 1) {
        console.log(symbol, priceData.priceType, priceData.nextPriceAccountKey); //eslint-disable-line
      }

      setPriceMap(updatePrice(symbol, product, priceData));

      if (symbol === selectedMarketPair) {
        Emitter.emit("PYTH_UPDATE", { symbol, price: priceData.price });
      }
    },
    [setPriceMap, selectedMarketPair],
  );

  useEffect(() => {
    const subscriptionIds: number[] = [];

    const fetchPyth = async () => {
      if (!connection) return;

      try {
        const accountInfo = await connection.getAccountInfo(ORACLE_PUBLIC_KEY);

        if (!accountInfo || !accountInfo.data) {
          return;
        }

        const { productAccountKeys, nextMappingAccount } = parseMappingData(accountInfo.data);

        let allProductAccountKeys = [...productAccountKeys];
        let anotherMappingAccount = nextMappingAccount;

        while (anotherMappingAccount) {
          const account = await connection.getAccountInfo(anotherMappingAccount);

          if (!account || !account.data) {
            anotherMappingAccount = null;
          } else {
            const { productAccountKeys: productKeys, nextMappingAccount: nextAccount } =
              parseMappingData(account.data);
            allProductAccountKeys = [...allProductAccountKeys, ...productKeys];
            anotherMappingAccount = nextAccount;
          }
        }

        const productsInfos = await connection.getMultipleAccountsInfo(
          productAccountKeys.map((product) => product),
          "confirmed",
        );

        const productsData = productsInfos.flatMap((product) =>
          product ? parseProductData(product.data) : [],
        );

        const priceAccountKeys = productsData.flatMap((product) =>
          product ? product.priceAccountKey : [],
        );

        const priceInfos = await connection.getMultipleAccountsInfo(priceAccountKeys, "confirmed");

        for (let i = 0; i < productsInfos.length; i++) {
          const productData = productsData[i];
          const product = productData.product;
          const symbol = product.generic_symbol;

          if (SUPPORTED_CRYPTO.includes(symbol)) {
            const priceAccountKey = productData.priceAccountKey;
            const priceInfo = priceInfos[i];
            handlePriceInfo(symbol, product, priceInfo);

            if (connection) {
              subscriptionIds.push(
                connection.onAccountChange(priceAccountKey, (account) => {
                  const priceInfo = parsePriceData(account.data);

                  const index = productAccountKeys
                    .map((product) => product.toBase58())
                    .indexOf(priceInfo.productAccountKey.toBase58());

                  const productData = productsData[index];
                  const product = productData.product;
                  const symbol = product.generic_symbol;
                  if (SUPPORTED_CRYPTO.includes(symbol)) {
                    handlePriceInfo(symbol, product, account);
                  }
                }),
              );
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch mapping info for ${err} ${ORACLE_PUBLIC_KEY.toBase58()}`); // eslint-disable-line
      }
    };

    fetchPyth();

    return () => {
      for (const subscriptionId of subscriptionIds) {
        connection?.removeAccountChangeListener(subscriptionId).catch(() => {
          // eslint-disable-next-line
          console.warn(
            `Unsuccessfully attempted to remove listener for subscription id ${subscriptionId}`,
          );
        });
      }
    };
  }, [connection, handlePriceInfo]);

  return <PythContext.Provider value={{ priceMap }}>{children}</PythContext.Provider>;
};

export const usePyth = (): PythContextProps => {
  const context = useContext(PythContext);
  if (context === undefined) {
    throw new Error("usePyth must be used within a PythProvider");
  }
  return context;
};
