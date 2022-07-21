import React, { useCallback, useMemo, useState } from "react";
import ReactSlider from "react-slider";
import { calculateOdd, PositionSideEnum, WalletSigner } from "parimutuelsdk";
import useSound from "use-sound";
import {
  Box,
  Flex,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import Countdown from "@components/Countdown/Countdown";
import { getWeb3Config } from "@constants/config";
import { useModal } from "@contexts/modal";
import { useParimutuel } from "@contexts/parimutuel";
import { useSetting } from "@contexts/setting";
import { useBalance } from "@hooks/useBalance";
import { useMint } from "@hooks/useMint";
import { useNotify } from "@hooks/useNotify";
import downArrowSvg from "@public/images/arrow_down.svg";
import upArrowSvg from "@public/images/arrow_up.svg";
import closeSvg from "@public/images/close.svg";
import countDownSvg from "@public/images/count_down.svg";
import walletSvg from "@public/images/wallet.svg";
import clickSound from "@public/mp3/click.mp3";

import "./PositionModal.module.css";

export const PositionModal: React.FC = () => {
  const { selectedParimutuel, positionSide } = useSetting();
  const { isPositionShown, setIsPositionShown } = useModal();
  const { selectedMarketPair } = useSetting();
  const { web3, parimutuels, getPositions, markets } = useParimutuel();
  const { usdcBalance } = useBalance();
  const wallet = useWallet();
  const [play] = useSound(clickSound);
  const notify = useNotify();
  const [amount, setAmount] = useState("");

  const { USDC_MINT } = getWeb3Config();
  const usdcAddress = USDC_MINT.toString();

  const usdcMint = useMint(usdcAddress);
  const usdcDecimals = useMemo(() => usdcMint?.decimals ?? 0, [usdcMint]);
  const contractSize = useMemo(() => markets[0]?.info.market.contractSize.toNumber(), [markets]);

  const parimutuelAccount = useMemo(
    () => parimutuels.find((parimutuel) => parimutuel.pubkey.toBase58() === selectedParimutuel),
    [parimutuels, selectedParimutuel],
  );

  const { parimutuel } = parimutuelAccount?.info || {};

  const isLong = positionSide === PositionSideEnum.LONG;
  const longPosition = parimutuel?.activeLongPositions.toNumber() ?? 0;
  const shortPosition = parimutuel?.activeShortPositions.toNumber() ?? 0;
  const poolSize = longPosition + shortPosition;

  const odd = calculateOdd(isLong ? longPosition : shortPosition, poolSize);
  const startTime = parimutuel?.timeWindowStart.toNumber() ?? 0;

  const handleClose = useCallback(() => {
    setIsPositionShown(false);
  }, [setIsPositionShown]);

  const handleEnterPosition = useCallback(async () => {
    play();

    const transactionId = await web3?.placePosition(
      wallet as WalletSigner,
      new PublicKey(selectedParimutuel),
      parseFloat(amount) * (10 ** usdcDecimals / contractSize),
      isLong ? 0 : 1,
      Date.now()
    );

    if (transactionId) {
      notify({
        title: "Position Entered",
        description: "Position has been placed successfully",
      });
      getPositions();
      setIsPositionShown(false);
    }
  }, [
    play,
    web3,
    wallet,
    selectedParimutuel,
    amount,
    usdcDecimals,
    contractSize,
    isLong,
    notify,
    getPositions,
    setIsPositionShown,
  ]);

  const handleInputChange = useCallback((e) => {
    if (e.target.value === "") setAmount("");
    if (e.target.value < 1) return;

    const ruleNumber = /^[0-9\b]+$/; //rules
    if (e.target.value === "" || ruleNumber.test(e.target.value)) {
      setAmount(e.target.value);
      return;
    }
  }, []);

  const handleSliderChange = useCallback(
    (index) => {
      const num = (usdcBalance.usdAmount * index) / 100;
      setAmount(Math.trunc(num).toString());
    },
    [usdcBalance],
  );

  return (
    <Modal isOpen={isPositionShown} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent overflow="hidden" bgColor="brand.200">
        <ModalHeader paddingY="8px" bgColor="brand.200">
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Flex flexDirection="row" alignItems="center" justifyContent="center">
              <Image width="24px" height="24px" src={countDownSvg} alt="countdown" />
              <Countdown endTime={startTime} variant="warning" />
            </Flex>
            <Box as="button" onClick={handleClose}>
              <Image src={closeSvg} alt="close" />
            </Box>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Flex flexDirection="column" my="12px">
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between">
              <Flex flexDirection="row" alignItems="center">
                <Image
                  width="24px"
                  height="24px"
                  src={isLong ? upArrowSvg : downArrowSvg}
                  alt="arrow"
                />
                <Text textStyle="title" color="white" ml="4px">
                  {selectedMarketPair}
                </Text>
              </Flex>
              <Text textStyle="small" color="white"></Text>
            </Flex>
            <Flex flexDirection="row" alignItems="center" justifyContent="flex-start" mt="8px">
              <Text textStyle="accent" color="white">
                {`$${poolSize / (10 ** usdcDecimals / contractSize)} / ${odd}X`}
              </Text>
            </Flex>
            <Flex
              flexDirection="row"
              alignItems="center"
              justifyContent="flex-start"
              height="44px"
              borderRadius="4px"
              bgColor="brand.100"
              paddingX="10px"
              my="16px"
            >
              <Image width="24px" height="24px" src={walletSvg} alt="wallet" />
              <Text textStyle="small" color="white" ml="4px">
                {`Available Funds: ${usdcBalance.usdAmount} USDC`}
              </Text>
            </Flex>
            <Flex flexDirection="column" alignItems="flex-start" justifyContent="flex-start">
              <Text textStyle="regular" color="gray.400">
                Enter Amount
              </Text>
              <Box width="100%" position="relative">
                <Input
                  placeholder="0"
                  textAlign="center"
                  color="white"
                  textStyle="accent"
                  bgColor="brand.100"
                  border="1px"
                  borderColor="white"
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
                  left={`${205 + (amount.toString().length / 2) * 9}px`}
                  zIndex="overlay"
                >
                  USDC
                </Text>
              </Box>
            </Flex>
            <Flex height="24px" mt="12px">
              <ReactSlider
                className="horizontal-slider"
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                onChange={handleSliderChange}
              />
            </Flex>
            <Box
              as="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bgColor="transparent"
              border="2px"
              borderColor={isLong ? "green.300" : "red.300"}
              borderRadius="5px"
              onClick={handleEnterPosition}
              height="42px"
              _hover={{ bgColor: "transparent" }}
              mt="40px"
            >
              <Text textStyle="emphasis" color={isLong ? "green.300" : "red.300"}>
                Lock Position
              </Text>
            </Box>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PositionModal;
