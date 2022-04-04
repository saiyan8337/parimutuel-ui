import React, { useCallback } from "react";
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletName } from "@solana/wallet-adapter-wallets";

import WalletItem from "@components/WalletItem/WalletItem";
import { useModal } from "@contexts/modal";
import closeSvg from "@public/images/close.svg";

export const WalletModal: React.FC = () => {
  const { wallets, wallet: selectedWallet, select } = useWallet();
  const { isWalletShown, setIsWalletShown } = useModal();

  const handleClose = useCallback(() => {
    setIsWalletShown(false);
  }, [setIsWalletShown]);

  const handleSelect = useCallback(
    (name: WalletName) => {
      setIsWalletShown(false);
      select(name);
    },
    [select, setIsWalletShown],
  );

  return (
    <Modal isOpen={isWalletShown} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent overflow="hidden" bgColor="brand.600">
        <ModalHeader paddingY="8px" bgColor="brand.500">
          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text textStyle="accent" color="gray.100">
              Select Wallet
            </Text>
            <Box as="button" onClick={handleClose}>
              <Image src={closeSvg} alt="close" />
            </Box>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <VStack spacing="8px" align="stretch" my="12px">
            {wallets?.map((wallet) => {
              return (
                <WalletItem
                  wallet={wallet}
                  key={wallet.name}
                  onSelectWallet={handleSelect}
                  selectedWallet={selectedWallet}
                />
              );
            })}
          </VStack>
        </ModalBody>
        <ModalFooter borderTop="1px" borderTopColor="gray.500">
          <Box
            as="button"
            bgColor="transparent"
            border="1px"
            borderColor="gray.500"
            borderRadius="2px"
            onClick={handleClose}
            paddingX="8px"
            paddingY="6px"
            _hover={{ bgColor: "transparent", borderColor: "teal.300" }}
          >
            <Text textStyle="caption" color="gray.100">
              Cancel
            </Text>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WalletModal;
