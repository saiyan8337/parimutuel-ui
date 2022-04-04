import React, { useCallback } from "react";
import { Box, BoxProps, Image, Text } from "@chakra-ui/react";
import { Wallet, WalletName } from "@solana/wallet-adapter-wallets";

export type WalletItemProps = BoxProps & {
  wallet: Wallet;
  selectedWallet: Wallet | null;
  onSelectWallet: (name: WalletName) => void;
};

const WalletItem: React.FC<WalletItemProps> = ({
  wallet,
  selectedWallet,
  onSelectWallet,
  ...restProps
}) => {
  const { icon, name } = wallet;

  const handelClick = useCallback(() => {
    onSelectWallet(name);
  }, [onSelectWallet, name]);

  return (
    <Box
      as="button"
      display="flex"
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      bgColor={selectedWallet?.name === name ? "teal.300" : "transparent"}
      border="1px"
      borderColor="gray.500"
      borderRadius="4px"
      height="40px"
      paddingX="16px"
      onClick={handelClick}
      _hover={{ borderColor: "teal.300" }}
      {...restProps}
    >
      <Image height="20px" width="20px" src={icon} alt="wallet icon" />
      <Text textStyle="small" color="gray.300" ml="12px">
        {name}
      </Text>
    </Box>
  );
};

export default WalletItem;
