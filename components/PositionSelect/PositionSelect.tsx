import React from "react";
import { Button, ButtonProps, Text } from "@chakra-ui/react";

export type PositionSelectProps = ButtonProps & {
  label: string;
  isSelected?: boolean;
  onClick: () => void;
};

export const PositionSelect: React.FC<PositionSelectProps> = ({
  label,
  isSelected,
  onClick,
  ...restProps
}) => {
  return (
    <Button
      variant="outline"
      bgColor="brand.100"
      borderRadius="4px"
      borderColor={isSelected ? "green.400" : "gray.400"}
      height="22px"
      paddingX="4px"
      _hover={{ bgColor: "transparent", borderColor: "green.300" }}
      onClick={onClick}
      {...restProps}
    >
      <Text textStyle="caption" color={isSelected ? "green.400" : "gray.400"}>
        {label.toUpperCase()}
      </Text>
    </Button>
  );
};

export default PositionSelect;
