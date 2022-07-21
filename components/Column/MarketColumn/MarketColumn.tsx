import React from "react";
import { formatDuration } from "@hxronetwork/parimutuelsdk";
import { Flex, FlexProps, Text } from "@chakra-ui/react";

export type MarketColumnProps = FlexProps & {
  cryptoPair: string;
  duration: number;
};

export const MarketColumn: React.FC<MarketColumnProps> = ({
  cryptoPair,
  duration,
  ...restProps
}) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="80px"
      borderBottom="1px"
      borderBottomColor="brand.100"
      borderRight="1px"
      borderRightColor="brand.100"
      {...restProps}
    >
      <Text textStyle="small" color="white">
        {cryptoPair}
      </Text>
      <Text textStyle="small" color="white">
        {formatDuration(duration)}
      </Text>
    </Flex>
  );
};

export default MarketColumn;
