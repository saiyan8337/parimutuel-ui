import { useToast } from "@chakra-ui/react";

export const useNotify = () => {
  const toast = useToast({
    position: "bottom-left",
    isClosable: true,
  });
  return toast;
};
