import React from "react";
import { Button, ButtonProps, Flex, Text } from "@chakra-ui/react";

export type DurationButtonProps = Omit<ButtonProps, "onClick"> & {
  label: string;
  unit: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
};

export const DurationButton: React.FC<DurationButtonProps> = ({
  label,
  unit,
  isSelected,
  isDisabled,
  ...restProps
}) => {
  return (
    <Button
      isDisabled={isDisabled}
      borderRadius="0px"
      borderBottom={isSelected ? "2px" : "0px"}
      borderBottomColor="green.400"
      bgColor="brand.100"
      _hover={{ bg: !isDisabled && "brand.50" }}
      _disabled={{ bg: "brand.100", cursor: "not-allowed" }}
      _active={{
        bg: isDisabled && "brand.100",
      }}
      {...restProps}
    >
      <Flex flexDirection="column">
        <Text textStyle="heading" color={isSelected ? "green.400" : "gray.50"}>
          {label}
        </Text>
        <Text textStyle="heading" color={isSelected ? "green.400" : "gray.50"}>
          {unit}
        </Text>
      </Flex>
    </Button>
  );
};

export default DurationButton;
