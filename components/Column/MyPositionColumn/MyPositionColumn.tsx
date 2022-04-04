import React from "react";
import { Flex, FlexProps, Image, Text } from "@chakra-ui/react";

import downArrowSvg from "@public/images/arrow_down.svg";
import upArrowSvg from "@public/images/arrow_up.svg";

export type MyPositionColumnProps = FlexProps & {
  long?: number;
  short?: number;
};

export const MyPositionColumn: React.FC<MyPositionColumnProps> = ({
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
      <Flex flexDirection="column" height="100%" width="100%">
        <Flex
          flexDirection="row"
          justifyContent={long ? "flex-start" : "center"}
          alignItems="center"
          borderBottom="1px"
          borderBottomColor="brand.100"
          height="50%"
          width="100%"
        >
          {long ? (
            <Image height="24px" width="24px" src={upArrowSvg} ml="30%" alt="up arrow" />
          ) : null}
          <Text textStyle="small" color="white" ml="2px">
            {long ? `$${long}` : "-"}
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          justifyContent={short ? "flex-start" : "center"}
          alignItems="center"
          borderBottom="1px"
          borderBottomColor="brand.100"
          height="50%"
          width="100%"
        >
          {short ? (
            <Image height="24px" width="24px" src={downArrowSvg} ml="30%" alt="down arrow" />
          ) : null}
          <Text textStyle="small" color="white" ml="2px">
            {short ? `$${short}` : "-"}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MyPositionColumn;
