import React from "react";
import { WalletSigner } from "parimutuelsdk";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { useParimutuel } from "@contexts/parimutuel";

export type InitializeStoreButtonProps = ButtonProps & {
  marketPubkey: string;
  storeWalletPubkey: string;
  protocolFeeBps: number;
  settlementFeeBps: number;
  onTransactionSubmitted?: (result: any) => any; //eslint-disable-line
};

const CreateStoreButton: React.FC<InitializeStoreButtonProps> = ({
  marketPubkey,
  storeWalletPubkey,
  protocolFeeBps,
  settlementFeeBps,
  onTransactionSubmitted,
  children = ["Initialize Store"],
  ...restProps
}) => {
  const { web3 } = useParimutuel();
  const wallet = useWallet();
  return (
    <Button
      border="1px"
      borderRadius="4px"
      borderColor="green.400"
      color="green.400"
      bgColor="transparent"
      width="100%"
      height="22px"
      variant="filled"
      _hover={{ bgColor: "transparent", borderColor: "green.300" }}
      onClick={async () => {
        if (!wallet.publicKey) return;

        const result = await web3?.createStore(
          wallet as WalletSigner,
          new PublicKey(storeWalletPubkey),
          new PublicKey(marketPubkey),
          protocolFeeBps,
          settlementFeeBps,
        );

        if (onTransactionSubmitted) onTransactionSubmitted(result);
      }}
      {...restProps}
    >
      {children}
    </Button>
  );
};

export default CreateStoreButton;
