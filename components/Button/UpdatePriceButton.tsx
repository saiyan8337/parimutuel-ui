import React, { useCallback } from "react";
import { WalletSigner } from "parimutuelsdk";
import { Button, ButtonProps, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { useParimutuel } from "@contexts/parimutuel";

export type UpdatePriceButtonProps = ButtonProps & {
  parimutuelPubkey: string;
};

export const UpdatePriceButton: React.FC<UpdatePriceButtonProps> = ({
  parimutuelPubkey,
  ...restProps
}) => {
  const { web3 } = useParimutuel();
  const wallet = useWallet();

  const handleUpdatePrice = useCallback(async () => {
    await web3?.updatePrice(wallet as WalletSigner, new PublicKey(parimutuelPubkey));
  }, [web3, parimutuelPubkey, wallet]);

  return (
    <>
      <Button
        border="1px"
        borderRadius="4px"
        borderColor="green.400"
        bgColor="green.400"
        width="50%"
        height="42px"
        _hover={{ bgColor: "transparent", borderColor: "brand.300" }}
        {...restProps}
        onClick={handleUpdatePrice}
      >
        <Text textStyle="small" color="white">
          Finalize
        </Text>
      </Button>
    </>
  );
};

export default UpdatePriceButton;
