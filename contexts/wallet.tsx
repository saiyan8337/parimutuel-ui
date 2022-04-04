import React, { useCallback, useMemo } from "react";
import { WalletError } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import {
  getLedgerWallet,
  getMathWallet,
  getPhantomWallet,
  getSolflareWallet,
  getSolletWallet,
  getSolongWallet,
  getTorusWallet,
} from "@solana/wallet-adapter-wallets";

import { getWeb3Url } from "@constants/config";
import { useNotify } from "@hooks/useNotify";

export const WalletConnectionProvider: React.FC = ({ children }) => {
  const notify = useNotify();
  const endpoint = useMemo(() => getWeb3Url(), []);
  const wallets = useMemo(
    () => [
      getPhantomWallet(),
      getSolflareWallet(),
      getTorusWallet({
        options: {
          clientId:
            "BM1tQXhRWuUS_fBbp2tARqX-BsOp-W-_HgW71DUSYWh7_TGvjgDzeL6Sp0FBm9UaE2FQYH-TkUp3CDC6LEQh52Y",
        },
      }),
      getLedgerWallet(),
      getSolongWallet(),
      getMathWallet(),
      getSolletWallet(),
    ],
    [],
  );

  const onError = useCallback(
    (error: WalletError) => {
      notify({
        title: "Wallet error",
        description: error.message,
      });
    },
    [notify],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        {children}
      </WalletProvider>
    </ConnectionProvider>
  );
};
