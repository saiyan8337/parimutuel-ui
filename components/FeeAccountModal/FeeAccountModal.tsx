import React, { useCallback, useMemo, useState } from "react";
import { getMarketPubkeys, WalletSigner } from "parimutuel-web3";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";

import { getWeb3Config } from "@constants/config";
import { useModal } from "@contexts/modal";
import { useParimutuel } from "@contexts/parimutuel";
import { useSetting } from "@contexts/setting";
import { useBalance } from "@hooks/useBalance";
import closeSvg from "@public/images/close.svg";
import walletSvg from "@public/images/wallet.svg";

export const FeeAccountModal: React.FC = () => {
  const { web3 } = useParimutuel();
  const { selectedMarketPair, selectedDurations } = useSetting();
  const wallet = useWallet();
  const { HXRO_MINT } = getWeb3Config();
  const { isFeeAccountShown, setIsFeeAccountShown, isDeposit } = useModal();
  const { traderAccountHxroBalance } = useBalance();
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const marketPubkey = useMemo(
    () =>
      getMarketPubkeys(getWeb3Config(), selectedMarketPair).find(
        (market) => market.duration === selectedDurations[0],
      )?.pubkey,
    [selectedMarketPair, selectedDurations],
  );

  const handleClose = useCallback(() => {
    setIsFeeAccountShown(false);
  }, [setIsFeeAccountShown]);

  const handleDepositOrWithdraw = useCallback(async () => {
    if (!marketPubkey) return;

    setIsLoading(true);
    if (isDeposit) {
      const transactionId = await web3?.depositFee(
        wallet as WalletSigner,
        marketPubkey,
        HXRO_MINT,
        parseFloat(amount) * 1000000000,
      );
      if (transactionId) {
        handleClose();
      }
    } else {
      const transactionId = await web3?.withdrawFee(
        wallet as WalletSigner,
        parseFloat(amount) * 1000000000,
      );
      if (transactionId) {
        handleClose();
      }
    }
    setIsLoading(false);
  }, [HXRO_MINT, amount, web3, isDeposit, wallet, marketPubkey, handleClose]);

  const handleInputChange = useCallback((e) => {
    if (e.target.value === "") setAmount("");

    const ruleNumber = /^[0-9.\b]+$/; //rules
    if (e.target.value === "" || ruleNumber.test(e.target.value)) {
      setAmount(e.target.value);
      return;
    }
  }, []);

  return (
    <Modal isOpen={isFeeAccountShown} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent overflow="hidden" bgColor="brand.200">
        <ModalHeader bgColor="brand.200">
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Box as="button" onClick={handleClose}>
              <Image src={closeSvg} alt="close" />
            </Box>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <VStack spacing="24px" align="stretch">
            <Text textStyle="display" color="white">
              {isDeposit ? "Deposit HXRO" : "Withdraw HXRO"}
            </Text>
            <Flex
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="flex-start"
              my="16px"
            >
              <Flex>
                <Image width="24px" height="24px" src={walletSvg} alt="wallet" />
                <Text textStyle="small" color="white" ml="4px">
                  {`Available Funds:`}
                </Text>
              </Flex>
              <Text textStyle="small" color="white" ml="28px">
                {`${traderAccountHxroBalance.cryptoAmount} HXRO ≈ ${traderAccountHxroBalance.usdAmount} USDC`}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
              <Text textStyle="regular" color="gray.400">
                Please enter the amount
              </Text>
              <Box width="100%" position="relative" borderBottom="1px" borderColor="gray.100">
                <Input
                  placeholder="0"
                  textAlign="left"
                  color="white"
                  textStyle="accent"
                  borderColor="transparent"
                  height="38px"
                  onChange={handleInputChange}
                  value={amount}
                />
                <Text
                  textStyle="regular"
                  color="gray.400"
                  ml="4px"
                  position="absolute"
                  top="6px"
                  left={`${30 + amount.toString().length * 9}px`}
                  zIndex="overlay"
                >
                  HXRO
                </Text>
              </Box>
            </Flex>
          </VStack>
        </ModalBody>
        <ModalFooter bgColor="brand.200" mt="80px">
          <Button
            isLoading={isLoading}
            width="100%"
            height="46px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgColor={isDeposit ? "green.400" : "red.300"}
            borderRadius="8px"
            onClick={handleDepositOrWithdraw}
            mb="24px"
            _hover={{ bgColor: isDeposit ? "green.300" : "red.400" }}
          >
            <Text textStyle="regular" fontWeight="bold" color="white">
              {isDeposit ? "FUND" : "WITHDRAW"}
            </Text>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FeeAccountModal;
