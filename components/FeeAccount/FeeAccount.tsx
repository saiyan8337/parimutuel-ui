import React, { useCallback, useMemo } from "react";
import { CryptoEnum } from "parimutuelsdk";
import { Box, Button, Flex, FlexProps, Image, Text } from "@chakra-ui/react";

import { useModal } from "@contexts/modal";
import { useBlock } from "@hooks/useBlock";
import { getCryptoAbbr, getCryptoIcon } from "@utils/utils";

export type FeeAccountProps = FlexProps & {
  crypto: CryptoEnum;
  cryptoAmount: string;
};

export const FeeAccount: React.FC<FeeAccountProps> = ({ crypto, cryptoAmount, ...restProps }) => {
  const { setIsDeposit, setIsFeeAccountShown } = useModal();
  const { isBlocked, setModal } = useBlock();
  const svgSrc = useMemo(() => getCryptoIcon(crypto), [crypto]);
  const cryptoAbbr = useMemo(() => getCryptoAbbr(crypto), [crypto]);

  const handleAction = useCallback(
    (isDeposit: boolean) => {
      if (isBlocked) {
        setModal && setModal(true);
        return;
      }

      setIsDeposit(isDeposit);
      setIsFeeAccountShown(true);
    },
    [setIsDeposit, setIsFeeAccountShown, isBlocked, setModal],
  );

  return (
    <Box
      display="flex"
      height={"64px"}
      width="251px"
      borderLeftRadius={"32px"}
      alignItems="center"
      boxShadow="0px 4px 4px #000000 25%"
      position="relative"
      {...restProps}
    >
      <Flex alignItems="center" flexGrow={1}>
        <Image height="32px" width="32px" src={svgSrc} ml="16px" alt="crypto" />
        <Flex flexDirection="column" flexGrow={1} ml="12px" mr="16px">
          <Flex justifyContent="space-between">
            <Text textStyle="small" fontWeight="500" color="gray.260">
              Available Funds:
            </Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text textStyle="small" fontWeight="500" color="green.400">
              {`${cryptoAmount} ${cryptoAbbr}`}
            </Text>
          </Flex>
          <Flex mt="4px">
            <Button
              variant="outline"
              bgColor="transparent"
              borderRadius="8px"
              borderColor={"green.400"}
              height="26px"
              width="80px"
              paddingX="4px"
              _hover={{ bgColor: "gray.600" }}
              onClick={() => handleAction(true)}
            >
              <Text textStyle="caption" color="green.400">
                Fund
              </Text>
            </Button>
            <Button
              variant="outline"
              bgColor="transparent"
              borderRadius="8px"
              borderColor={"red.300"}
              height="26px"
              width="80px"
              paddingX="4px"
              _hover={{ bgColor: "gray.600" }}
              onClick={() => handleAction(false)}
              ml="8px"
            >
              <Text textStyle="caption" color="red.300">
                Withdraw
              </Text>
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default FeeAccount;
