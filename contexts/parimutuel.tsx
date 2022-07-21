import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useInterval } from "react-use";
import {
  decodeAccount,
  getMarketPubkeys,
  ParimutuelAccount,
  ParimutuelMarket,
  ParimutuelNetwork,
  ParimutuelPosition,
  ParimutuelTraderFeePayerAccount,
  ParimutuelWeb3,
} from "@hxronetwork/parimutuelsdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { getWeb3Config } from "@constants/config";
import _isEmpty from "lodash/isEmpty";

import { useSetting } from "./setting";

export interface ParimutuelContextProps {
  web3?: ParimutuelWeb3;
  traderFeePayerAccount?: ParimutuelTraderFeePayerAccount;
  network?: ParimutuelNetwork;
  markets: ParimutuelMarket[];
  parimutuels: ParimutuelAccount[];
  positions: ParimutuelPosition[];
  getPositions: () => void;
  getFeeAccounts: () => void;
  protocolFeeAmount: number;
  settlementFeeAmount: number;
  settled: string[];
  setSettled: (values: string[]) => void;
}

const defaultContext: ParimutuelContextProps = {
  web3: undefined,
  traderFeePayerAccount: undefined,
  network: undefined,
  markets: [],
  parimutuels: [],
  positions: [],
  getPositions: () => null,
  getFeeAccounts: () => null,
  protocolFeeAmount: 0,
  settlementFeeAmount: 0,
  settled: [],
  setSettled: () => null,
};

const ParimutuelContext = React.createContext<ParimutuelContextProps>({ ...defaultContext });

export const ParimutuelProvider: React.FC = ({ children }) => {
  const { connection } = useConnection();
  const config = getWeb3Config();
  const web3 = useMemo(() => new ParimutuelWeb3(config, connection), [connection, config]);
  const { selectedMarketPair } = useSetting();
  const wallet = useWallet();
  const { publicKey: walletPubkey } = wallet;

  const [traderFeePayerAccount, setTraderFeePayerAccount] = useState<
    ParimutuelTraderFeePayerAccount | undefined
  >(undefined);
  const [parimutuels, setParimutuels] = useState<ParimutuelAccount[]>([]);
  const [network, setNetwork] = useState<ParimutuelNetwork | undefined>(undefined);
  const [markets, setMarkets] = useState<ParimutuelMarket[]>([]);
  const [positions, setPositions] = useState<ParimutuelPosition[]>([]);
  const [protocolFeeAmount, setProtocolFeeAmount] = useState<number>(
    defaultContext.protocolFeeAmount,
  );
  const [settlementFeeAmount, setSettlementFeeAmount] = useState<number>(
    defaultContext.settlementFeeAmount,
  );
  const [settled, setSettled] = useState<string[]>(defaultContext.settled);

  const fetchPositions = useCallback(async () => {
    if (!walletPubkey || _isEmpty(markets)) return;
    const positions = await web3.getUserPositions(walletPubkey, markets);
    setPositions(positions);
  }, [markets, walletPubkey, web3]);

  const fetchParimutuels = useCallback(async () => {
    const marketPubkeys = getMarketPubkeys(config, selectedMarketPair);
    const parimutuels = await web3.getParimutuels(marketPubkeys, 5);
    if (parimutuels) setParimutuels(parimutuels);
  }, [selectedMarketPair, web3, config]);

  const fetchFees = useCallback(async () => {
    if (!network || !markets) return;
    const market = markets[0];
    const {
      network: { protocolFeeAmount, settlementFeeAmount },
    } = await web3.getFees(
      new PublicKey(network.info.network.authority),
      new PublicKey(market.info.market.authority),
    );

    setProtocolFeeAmount(protocolFeeAmount);
    setSettlementFeeAmount(settlementFeeAmount);
  }, [markets, network, web3]);

  const fetchFeeAccounts = useCallback(async () => {
    if (!network || !wallet?.publicKey) return;

    const feePayerAccount = await web3.getTraderFeePayerAccount(wallet?.publicKey, network.pubkey);
    setTraderFeePayerAccount(feePayerAccount);
  }, [network, wallet.publicKey, web3]);

  useInterval(() => {
    fetchParimutuels();
    fetchFees();
    fetchPositions();
  }, 1000 * 3);

  useEffect(() => {
    if (!network || !wallet?.publicKey) return;
    let subscriptionId: number;

    const fetchFeeAccounts = async () => {
      if (!network || !wallet?.publicKey) return;

      const feePayerAccount = await web3.getTraderFeePayerAccount(
        wallet?.publicKey,
        network.pubkey,
      );
      setTraderFeePayerAccount(feePayerAccount);

      if (web3.connection) {
        subscriptionId = web3.connection.onAccountChange(feePayerAccount.pubkey, (account) => {
          setTraderFeePayerAccount((prev) => {
            if (prev) {
              return {
                ...prev,
                account,
                info: {
                  tokenAccount: {
                    ...prev.info.tokenAccount,
                    account,
                    info: decodeAccount(account.data),
                  },
                },
              };
            }
            return prev;
          });
        });
      }
    };

    fetchFeeAccounts();

    return () => {
      web3.connection?.removeAccountChangeListener(subscriptionId).catch(() => {
        // eslint-disable-next-line
        console.warn(
          `Unsuccessfully attempted to remove listener for subscription id ${subscriptionId}`,
        );
      });
    };
  }, [network, wallet, web3]);

  useEffect(() => {
    fetchPositions();
    fetchFeeAccounts();
  }, [fetchPositions, fetchFeeAccounts]);

  useEffect(() => {
    Promise.all([web3.getNetwork(), web3.getMarkets(selectedMarketPair)]).then(
      ([network, markets]) => {
        setNetwork(network);
        setMarkets(markets);
      },
    );
  }, [web3, walletPubkey, selectedMarketPair]);

  const setSettledParimutuels = (values: string[]) => {
    setSettled(values);
  };

  return (
    <ParimutuelContext.Provider
      value={{
        web3,
        traderFeePayerAccount,
        network,
        markets,
        parimutuels,
        positions,
        getPositions: fetchPositions,
        getFeeAccounts: fetchFeeAccounts,
        protocolFeeAmount,
        settlementFeeAmount,
        settled,
        setSettled: setSettledParimutuels,
      }}
    >
      {children}
    </ParimutuelContext.Provider>
  );
};

export const useParimutuel = () => {
  const context = useContext(ParimutuelContext);
  if (context === undefined) {
    throw new Error("useParimutuel must be used within a ParimutuelProvider");
  }
  return context;
};
