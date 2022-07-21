import React, { useCallback, useMemo, useState } from "react";
import { CryptoEnum } from "@hxronetwork/parimutuelsdk";
import {
  Button,
  Flex,
  Image,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverProps,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import { getWeb3Config } from "@constants/config";
import { useNotify } from "@hooks/useNotify";
import { getCryptoIcon } from "@utils/utils";

const requestAirdrop = (wallet: string, token: string) =>
  fetch("/api/faucet", {
    method: "POST",
    body: JSON.stringify({ wallet, token }),
    headers: { "Content-Type": "application/json" },
  });

export type AirDropProps = PopoverProps & {
  isConnected: boolean;
  onClickConnect: () => void;
};

const AirDrop: React.FC<AirDropProps> = ({ isConnected, onClickConnect, ...restProps }) => {
  const { publicKey } = useWallet();
  const notify = useNotify();
  const { connection } = useConnection();
  const { HXRO_MINT, USDC_MINT } = getWeb3Config();

  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoEnum | undefined>(undefined);

  const solSvg = getCryptoIcon(CryptoEnum.SOLANA);
  const usdcSvg = getCryptoIcon(CryptoEnum.USDC);
  const hxroSvg = getCryptoIcon(CryptoEnum.HXRO);

  const handleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  const handleAirdrop = useCallback(
    async (crypto: CryptoEnum) => {
      if (!publicKey) return;

      setSelectedCrypto(crypto);
      setIsLoading(true);
      const mintKey = crypto === CryptoEnum.USDC ? USDC_MINT.toBase58() : HXRO_MINT.toBase58();

      let result;

      if (crypto === CryptoEnum.SOLANA) {
        result = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);
      } else {
        result = await requestAirdrop(publicKey.toBase58(), mintKey);
      }

      setIsLoading(false);

      if (result) {
        notify({
          title: "Airdrop Completed",
          description: "Account has been funded",
        });
      } else {
        notify({
          title: "Airdrop Failed",
          description: "Please try again",
        });
      }
    },
    [publicKey, connection, HXRO_MINT, USDC_MINT, notify],
  );

  const handleClick = useCallback(() => {
    if (!isConnected) {
      onClickConnect();
    } else {
      handleOpen();
    }
  }, [isConnected, handleOpen, onClickConnect]);

  const AirDropButton = useMemo(
    () => (
      <Button
        border="1px"
        borderRadius="4px"
        borderColor={isConnected ? "green.400" : "gray.50"}
        bgColor="transparent"
        height="36px"
        padding="0px"
        mr="8px"
        _hover={{
          bgColor: "transparent",
          borderColor: "green.300",
        }}
        onClick={handleClick}
      >
        <Image height="20px" width="20px" src="/images/airdrop.svg" alt="air drop" />
      </Button>
    ),
    [isConnected, handleClick],
  );

  return isConnected ? (
    <Popover placement="bottom-end" {...restProps}>
      <PopoverTrigger>{AirDropButton}</PopoverTrigger>
      <PopoverContent width="200px">
        <PopoverBody>
          <Flex justifyContent="space-between" alignItems="center" mt="4px">
            <Flex justifyContent="center" alignItems="center">
              <Image height="24px" width="24px" src={solSvg} alt="sol" />
              <Text textStyle="small" color="gray.400" ml="8px">
                SOL
              </Text>
            </Flex>
            <Button
              isLoading={isLoading && selectedCrypto === CryptoEnum.SOLANA}
              borderRadius="4px"
              bgColor="green.400"
              height="24px"
              padding="0px"
              mr="8px"
              _hover={{
                bgColor: "green.2=300",
              }}
              onClick={() => handleAirdrop(CryptoEnum.SOLANA)}
            >
              <Text textStyle="small" color="white">
                Add
              </Text>
            </Button>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mt="10px">
            <Flex justifyContent="center" alignItems="center">
              <Image height="24px" width="24px" src={usdcSvg} alt="usdc" />
              <Text textStyle="small" color="gray.400" ml="8px">
                USDC
              </Text>
            </Flex>
            <Button
              isLoading={isLoading && selectedCrypto === CryptoEnum.USDC}
              borderRadius="4px"
              bgColor="green.400"
              height="24px"
              padding="0px"
              mr="8px"
              _hover={{
                bgColor: "green.2=300",
              }}
              onClick={() => handleAirdrop(CryptoEnum.USDC)}
            >
              <Text textStyle="small" color="white">
                Add
              </Text>
            </Button>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mt="10px" mb="4px">
            <Flex justifyContent="center" alignItems="center">
              <Image height="24px" width="24px" src={hxroSvg} alt="hxro" />
              <Text textStyle="small" color="gray.400" ml="8px">
                HXRO
              </Text>
            </Flex>
            <Button
              isLoading={isLoading && selectedCrypto === CryptoEnum.HXRO}
              borderRadius="4px"
              bgColor="green.400"
              height="24px"
              padding="0px"
              mr="8px"
              _hover={{
                bgColor: "green.200",
              }}
              onClick={() => handleAirdrop(CryptoEnum.HXRO)}
            >
              <Text textStyle="small" color="white">
                Add
              </Text>
            </Button>
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  ) : (
    <>{AirDropButton}</>
  );
};

export default AirDrop;
