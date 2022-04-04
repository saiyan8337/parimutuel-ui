import React from "react";
import { useRouter } from "next/router";
import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";

import discordSvg from "@public/images/social_discord.svg";
import twitterSvg from "@public/images/social_twitter.svg";
import solanaSvg from "@public/images/solana.svg";

export const Footer: React.FC = () => {
  const router = useRouter();
  return (
    <Flex
      flexDirection="row"
      height="70px"
      justifyContent="space-between"
      alignItems="center"
      bgColor="brand.700"
      margin="0"
      padding="0 20px"
    >
      <Flex flexDirection="row" alignItems="center">
        <Text textStyle="small" color="gray.400" mr="8px">
          Built on
        </Text>
        <Image src={solanaSvg} height="30px" width="100px" alt="solana" />
      </Flex>
      <Flex flexDirection="row" margin="0 auto">
        <Link href="https://discord.gg/3HgNPbr9">
          <Image src={discordSvg} alt="discord" />
        </Link>
        <Link href="https://twitter.com/hxronetwork" ml="8px">
          <Image src={twitterSvg} alt="twitter" />
        </Link>
      </Flex>
      <Flex flexDirection="row">
        <Button style={{ visibility: "hidden" }} onClick={() => router.push("/operators/signup")}>
          Become an Operator
        </Button>
      </Flex>
    </Flex>
  );
};

export default Footer;
