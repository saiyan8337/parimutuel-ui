import React from "react";
import { Flex, FlexProps, Text } from "@chakra-ui/react";

export type StatsBoxProps = Omit<FlexProps, "direction"> & {
  title: string;
  value: string;
  direction?: "horizontal" | "vertical";
};

export const StatsBox: React.FC<StatsBoxProps> = ({
  title,
  value,
  direction = "horizontal",
  ...restProps
}) => {
  return (
    <Flex {...restProps}>
      <Flex
        flexDirection={direction === "horizontal" ? "row" : "column"}
        justifyContent={direction === "horizontal" ? "space-between" : "center"}
        alignItems={direction === "horizontal" ? "center" : "flex-start"}
        bgColor="brand.100"
        height={direction === "horizontal" ? "32px" : "56px"}
        width="100%"
        paddingX="20px"
      >
        <Text textStyle="small" color="gray.50">
          {title}
        </Text>
        <Text textStyle="small" color="gray.300" lineHeight="14px">
          {value}
        </Text>
      </Flex>
    </Flex>
  );
};

export default StatsBox;
