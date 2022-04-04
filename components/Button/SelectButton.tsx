import React, { useCallback } from "react";
import { Button, ButtonProps, Text } from "@chakra-ui/react";

export type SelectButtonProps = Omit<ButtonProps, "onClick"> & {
  label: string;
  value: string;
  isSelected?: boolean;
  isDisabled?: boolean;
  onClick?: (value: string) => void;
};

export const SelectButton: React.FC<SelectButtonProps> = ({
  label,
  value,
  isSelected,
  isDisabled,
  onClick,
  ...restProps
}) => {
  const handleClick = useCallback(() => {
    if (onClick) onClick(value);
  }, [value, onClick]);

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
      onClick={handleClick}
      {...restProps}
    >
      <Text textStyle="small" color={isSelected ? "green.400" : "gray.50"}>
        {label}
      </Text>
    </Button>
  );
};

export default SelectButton;
