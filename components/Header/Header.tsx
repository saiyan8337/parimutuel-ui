import React, { useCallback } from "react";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";

import AirDrop from "@components/AirDrop/AirDrop";
import ConnectButton from "@components/Button/ConnectButton";
import { useModal } from "@contexts/modal";
import logoSvg from "@public/images/logo.svg";

export const Header: React.FC = () => {
  const {
    publicRuntimeConfig: { APP_ENV },
  } = getConfig();
  const router = useRouter();
  const { setIsWalletShown } = useModal();
  const { connected, publicKey } = useWallet();

  const handleConnect = useCallback(() => {
    setIsWalletShown(true);
  }, [setIsWalletShown]);

  const handleChange = useCallback(() => setIsWalletShown(true), [setIsWalletShown]);

  return (
    <Flex height="62px" justifyContent="space-between" alignItems="center">
      <Image
        onClick={() => {
          if (router.pathname !== "/") router.push("/");
        }}
        height="60px"
        width="160px"
        src={logoSvg}
        ml="28px"
        mt="24px"
        style={{ cursor: "pointer" }}
        alt="logo"
      />
      <Text textStyle="small" color="gray.400">
        {String(
          `You are on HXRO network ${APP_ENV === "dev" ? "devnet" : "alpha"} 1.0`,
        ).toUpperCase()}
      </Text>
      <Flex justifyContent="space-between" alignItems="center">
        {APP_ENV === "dev" && <AirDrop isConnected={connected} onClickConnect={handleConnect} />}
        <ConnectButton
          isConnected={connected}
          publicKey={publicKey?.toString()}
          mr="36px"
          onClickConnect={handleConnect}
          onClickChange={handleChange}
        />
      </Flex>
    </Flex>
  );
};

export default Header;
