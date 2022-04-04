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

import { useModal } from "@contexts/modal";
import closeSvg from "@public/images/close.svg";

export const WhitelistModal: React.FC = () => {
  const { isWhitelistShown, setIsWhitelistShown, isBlacklistShown, setIsBlacklistShown } =
    useModal();

  const handleClose = useCallback(() => {
    setIsWhitelistShown(false);
    setIsBlacklistShown(false);
  }, [setIsWhitelistShown, setIsBlacklistShown]);

  return (
    <Modal isOpen={isWhitelistShown || isBlacklistShown} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent overflow="hidden" bgColor="brand.200">
        <ModalHeader bgColor="brand.200">
          <Flex flexDirection="row" justifyContent="flex-end" alignItems="center">
            <Box as="button" onClick={handleClose}>
              <Image src={closeSvg} alt="close" />
            </Box>
          </Flex>
        </ModalHeader>
        <ModalBody>
          <VStack spacing="24px" align="stretch">
            <Text textStyle="display" color="white">
              {isBlacklistShown ? "No Access" : "Invitation Only"}
            </Text>
            <Text textStyle="regular" color="gray.200">
              {isBlacklistShown
                ? "You don't have the access to this product. please try again later"
                : "Currently, this mainnet product is limited to whitelist invitation only, please contact official for access"}
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter bgColor="brand.200" mt="80px">
          <Box
            as="button"
            width="100%"
            height="46px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bgColor="green.400"
            borderRadius="8px"
            onClick={handleClose}
            mb="24px"
            _hover={{ bgColor: "green.200" }}
          >
            <Text textStyle="regular" fontWeight="bold" color="gray.100">
              GOT IT
            </Text>
          </Box>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default WhitelistModal;
