import React from "react";
import Spinner from "react-loader-spinner";
import { Flex } from "@chakra-ui/react";

export const Loader: React.FC = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <Spinner type="Circles" color="gray.250" height={80} width={80} />
    </Flex>
  );
};

export default Loader;
