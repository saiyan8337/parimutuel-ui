import React from "react";
import { Flex } from "@chakra-ui/react";

export const CreateMarketPanel: React.FC = () => {
  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      width="248px"
      height="90px"
      borderTop="1px"
      borderBottom="1px"
      borderTopColor="brand.300"
      borderBottomColor="brand.300"
    ></Flex>
  );
};

export default CreateMarketPanel;
