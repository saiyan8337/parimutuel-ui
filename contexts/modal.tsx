import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { shortenAddress } from "parimutuelsdk";
import { useWallet } from "@solana/wallet-adapter-react";

import FeeAccountModal from "@components/FeeAccountModal/FeeAccountModal";
import GeoBlockModal from "@components/GeoBlockModal/GeoBlockModal";
import PositionModal from "@components/PositionModal/PositionModal";
import WalletModal from "@components/WalletModal/WalletModal";
import WhitelistModal from "@components/WhitelistModal/WhitelistModal";
import { useNotify } from "@hooks/useNotify";

export interface ModalContextProps {
  isWalletShown: boolean;
  setIsWalletShown: (open: boolean) => void;
  isPositionShown: boolean;
  setIsPositionShown: (open: boolean) => void;
  isWhitelistShown: boolean;
  setIsWhitelistShown: (open: boolean) => void;
  isBlacklistShown: boolean;
  setIsBlacklistShown: (open: boolean) => void;
  isGeoBlockShown: boolean;
  setIsGeoBlockShown: (open: boolean) => void;
  isDeposit: boolean;
  setIsDeposit: (value: boolean) => void;
  isFeeAccountShown: boolean;
  setIsFeeAccountShown: (open: boolean) => void;
}

const defaultContext: ModalContextProps = {
  isWalletShown: false,
  setIsWalletShown: () => null,
  isPositionShown: false,
  setIsPositionShown: () => null,
  isWhitelistShown: false,
  setIsWhitelistShown: () => null,
  isBlacklistShown: false,
  setIsBlacklistShown: () => null,
  isGeoBlockShown: false,
  setIsGeoBlockShown: () => null,
  isDeposit: false,
  setIsDeposit: () => null,
  isFeeAccountShown: false,
  setIsFeeAccountShown: () => null,
};

export const ModalContext = createContext<ModalContextProps>(defaultContext);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const notify = useNotify();
  const [isWalletShown, setIsWalletShown] = useState(defaultContext.isWalletShown);
  const [isPositionShown, setIsPositionShown] = useState(defaultContext.isPositionShown);
  const [isWhitelistShown, setIsWhitelistShown] = useState(defaultContext.isWhitelistShown);
  const [isBlacklistShown, setIsBlacklistShown] = useState(defaultContext.isWhitelistShown);
  const [isGeoBlockShown, setIsGeoBlockShown] = useState(defaultContext.isGeoBlockShown);
  const [isDeposit, setIsDeposit] = useState(defaultContext.isDeposit);
  const [isFeeAccountShown, setIsFeeAccountShown] = useState(defaultContext.isFeeAccountShown);
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    if (publicKey) {
      const base58 = publicKey.toBase58();
      const keyToDisplay = base58.length > 20 ? shortenAddress(base58) : base58;

      setNotification(true);

      notify({
        title: "Wallet update",
        description: "Connected to wallet " + keyToDisplay,
      });
    }
  }, [publicKey]); //eslint-disable-line
  // TODO: make notify pure

  useEffect(() => {
    if (notification && !connected) {
      notify({
        title: "Wallet update",
        description: "Disconnected from wallet",
      });
    }
  }, [connected, notification]); //eslint-disable-line

  return (
    <ModalContext.Provider
      value={{
        ...defaultContext,
        isWalletShown,
        setIsWalletShown,
        isPositionShown,
        setIsPositionShown,
        isWhitelistShown,
        setIsWhitelistShown,
        isBlacklistShown,
        setIsBlacklistShown,
        isGeoBlockShown,
        setIsGeoBlockShown,
        isDeposit,
        setIsDeposit,
        isFeeAccountShown,
        setIsFeeAccountShown,
      }}
    >
      {children}
      <WalletModal />
      <PositionModal />
      <WhitelistModal />
      <GeoBlockModal />
      <FeeAccountModal />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
