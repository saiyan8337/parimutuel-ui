import React from "react";
import { calculateOdd } from "@hxronetwork/parimutuelsdk";
import { Flex, FlexProps, Image, Text } from "@chakra-ui/react";

import downArrowSvg from "@public/images/arrow_down.svg";
import upArrowSvg from "@public/images/arrow_up.svg";

export type PoolSizeColumnProps = FlexProps & {
  poolSize: number;
  long: number;
  short: number;
};

export const PoolSizeColumn: React.FC<PoolSizeColumnProps> = ({
  poolSize,
  long,
  short,
  ...restProps
}) => {
  return (
    <Flex
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      borderRight="1px"
      borderRightColor="brand.100"
      height="80px"
      {...restProps}
    >
      <Flex
        borderBottom="1px"
        borderBottomColor="brand.100"
        borderRight="1px"
        borderRightColor="brand.100"
        height="100%"
        width="40%"
        justifyContent="center"
        alignItems="center"
      >
        <Text textStyle="small" color="white">
          {`$${poolSize}`}
        </Text>
      </Flex>
      <Flex flexDirection="column" height="100%" width="60%" ml="2px">
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px"
          borderBottomColor="brand.100"
          height="50%"
          width="100%"
        >
          <Image height="20px" width="20px" src={upArrowSvg} alt="up arrow" />
          <Text textStyle="caption" color="white">
            {`$${long}/`}
          </Text>
          <Text textStyle="caption" color="white">
            {`${calculateOdd(long, long + short)}X`}
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          justifyContent="center"
          alignItems="center"
          borderBottom="1px"
          borderBottomColor="brand.100"
          height="50%"
          width="100%"
        >
          <Image height="20px" width="20px" src={downArrowSvg} alt="down arrow" />
          <Text textStyle="caption" color="white">
            {`$${short}/`}
          </Text>
          <Text textStyle="caption" color="white">
            {`${calculateOdd(short, long + short)}X`}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default PoolSizeColumn;
