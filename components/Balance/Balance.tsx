import React, { useMemo } from "react";
import { CryptoEnum } from "@hxronetwork/parimutuelsdk";
import { Box, Flex, FlexProps, Image, Text } from "@chakra-ui/react";

import balanceBgSvg from "@public/images/balance_bg.svg";
import { getCryptoAbbr, getCryptoIcon, getCryptoName } from "@utils/utils";

export type BalanceProps = FlexProps & {
  crypto: CryptoEnum;
  fiatAmount?: string;
  showFiatAmount?: boolean;
  cryptoAmount: string;
};

export const Balance: React.FC<BalanceProps> = ({
  crypto,
  fiatAmount,
  showFiatAmount = true,
  cryptoAmount,
  ...restProps
}) => {
  const svgSrc = useMemo(() => getCryptoIcon(crypto), [crypto]);
  const cryptoName = useMemo(() => getCryptoName(crypto), [crypto]);
  const cryptoAbbr = useMemo(() => getCryptoAbbr(crypto), [crypto]);

  return (
    <Box
      display="flex"
      bgImage={balanceBgSvg}
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
            <Text textStyle="small" color="gray.260">
              {cryptoName}
            </Text>
            {showFiatAmount && (
              <Text textStyle="small" fontWeight="700" color="green.400">
                {`${typeof fiatAmount !== "string" ? "--" : fiatAmount} USD`}
              </Text>
            )}
          </Flex>
          <Flex justifyContent="space-between">
            <Text textStyle="caption" color="gray.260">
              {cryptoAbbr}
            </Text>
            <Text textStyle="caption" fontWeight="700" color="green.400">
              {cryptoAmount}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Balance;
