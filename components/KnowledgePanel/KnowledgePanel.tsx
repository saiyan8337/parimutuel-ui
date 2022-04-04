import React from "react";
import { Flex, Link, Text } from "@chakra-ui/react";

import PanelName from "@components/PanelName/PanelName";

export const KnowledgePanel: React.FC = () => {
  return (
    <Flex flexDirection="column" width="251px" height="238px" mt="12px">
      <PanelName name="Knowledge Base" />
      <Link
        bgColor="brand.100"
        height="56px"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{ bg: "brand.50" }}
      >
        <Text textStyle="small" color="gray.100">
          What is Parimutuel
        </Text>
      </Link>
      <Link
        bgColor="brand.100"
        height="56px"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{ bg: "brand.50" }}
        mt="4px"
      >
        <Text textStyle="small" color="gray.100">
          How to play
        </Text>
      </Link>
      <Link
        bgColor="brand.100"
        height="56px"
        width="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        _hover={{ bg: "brand.50" }}
        mt="4px"
      >
        <Text textStyle="small" color="gray.100">
          FAQ
        </Text>
      </Link>
    </Flex>
  );
};

export default KnowledgePanel;
