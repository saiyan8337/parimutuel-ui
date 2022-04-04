import React from "react";
import { Flex, FlexProps, Text } from "@chakra-ui/react";

export type SettledPriceColumnProps = FlexProps & {
  price?: number;
};

export const SettledPriceColumn: React.FC<SettledPriceColumnProps> = ({ price, ...restProps }) => {
  return (
    <Flex
      flexDirection="row"
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
        {price ? `$${price.toFixed(3)}` : "-"}
      </Text>
    </Flex>
  );
};

export default SettledPriceColumn;
