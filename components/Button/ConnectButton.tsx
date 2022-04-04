import React from "react";
import { shortenAddress } from "parimutuel-web3";
import {
  Box,
  Button,
  ButtonGroup,
  ButtonGroupProps,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";

import dotSvg from "@public/images/dot.svg";

export type ConnectButtonProps = ButtonGroupProps & {
  isConnected: boolean;
  publicKey?: string;
  onClickConnect: () => void;
  onClickChange: () => void;
};

const ConnectButton: React.FC<ConnectButtonProps> = ({
  isConnected,
  onClickConnect,
  onClickChange,
  publicKey,
  ...restProps
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <>
      <ButtonGroup isAttached {...restProps}>
        <Button
          border="1px"
          borderRadius="4px"
          borderColor={isConnected ? "gray.50" : "green.400"}
          bgColor="transparent"
          width="120px"
          height="36px"
          mr="-0px"
          padding="0px"
          _hover={{
            bgColor: "transparent",
            borderColor: isConnected ? "gray.300" : "green.300",
          }}
          onClick={onClickConnect}
        >
          <Text textStyle="accent" color={isConnected ? "gray.50" : "green.400"}>
            {publicKey ? shortenAddress(publicKey) : "Connect"}
          </Text>
        </Button>
        <Popover
          returnFocusOnClose={false}
          isOpen={isOpen}
          onClose={close}
          placement="bottom-end"
          closeOnBlur={true}
        >
          <PopoverTrigger>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              as="button"
              border="1px"
              borderRadius="4px"
              borderColor={isConnected ? "green.400" : "gray.50"}
              borderLeftColor={isConnected ? "green.400" : "transparent"}
              bgColor="transparent"
              width="36px"
              height="36px"
              _hover={{
                bgColor: "transparent",
                borderColor: isConnected ? "green.300" : "gray.300",
              }}
              onClick={open}
            >
              <Image height="16px" width="16px" src={dotSvg} alt="dot" />
            </Box>
          </PopoverTrigger>
          <PopoverContent bgColor="brand.100" border="0px" borderRadius="0px" width="130px">
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              as="button"
              border="0px"
              bgColor="transparent"
              _hover={{
                bgColor: "transparent",
              }}
              onClick={onClickChange}
            >
              <Text textStyle="regular" color="white">
                Change Wallet
              </Text>
            </Box>
          </PopoverContent>
        </Popover>
      </ButtonGroup>
    </>
  );
};

export default ConnectButton;
