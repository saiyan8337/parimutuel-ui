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

export const GeoBlockModal: React.FC = () => {
  const { isGeoBlockShown, setIsGeoBlockShown } = useModal();

  const handleClose = useCallback(() => {
    setIsGeoBlockShown(false);
  }, [setIsGeoBlockShown]);

  return (
    <Modal isOpen={isGeoBlockShown} onClose={handleClose}>
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
              Not Available
            </Text>
            <Text textStyle="regular" color="gray.200">
              Hxro Network does not support your current region, but you are welcome to explore the
              product
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

export default GeoBlockModal;
