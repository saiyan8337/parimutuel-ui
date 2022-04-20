import React from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { Flex } from "@chakra-ui/react";

import BalancePanel from "@components/BalancePanel/BalancePanel";
import FeeAccountPanel from "@components/FeeAccountPanel/FeeAccountPanel";
import Footer from "@components/Footer/Footer";
import GlobalStatsPanel from "@components/GlobalStatsPanel/GlobalStatsPanel";
import Header from "@components/Header/Header";
import LiquidityPanel from "@components/LiquidityPanel/LiquidityPanel";
import MarketPanel from "@components/MarketPanel/MarketPanel";
import MarketSelectPanel from "@components/MarketSelectPanel/MarketSelectPanel";
import PositionPanel from "@components/PositionPanel/PositionPanel";
import StakingPanel from "@components/StakingPanel/StakingPanel";

const TradingView = dynamic(
  () => import("@components/TradingView/TradingView").then((mod) => mod as any), // eslint-disable-line
  { ssr: false },
);

const Home: NextPage = () => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      width="100%"
      minWidth="1560px"
      minHeight="100vh"
      bgColor="brand.200"
    >
      <Flex flexDirection="column">
        <Header />
        <Flex flexDirection="row" mt="20px">
          <Flex flexDirection="row" flexGrow={1} minWidth="1260px">
            <Flex flexDirection="column" ml="35px" mt="14px">
              <MarketSelectPanel />
              <LiquidityPanel />
              <GlobalStatsPanel />
            </Flex>
            <Flex flexDirection="column" mx="29px" flexGrow={1} minWidth="960px" mt="20px">
              <TradingView />
              <MarketPanel />
            </Flex>
            <Flex flexDirection="column" mt="14px" mr="20px">
              <BalancePanel />
              <FeeAccountPanel />
              <StakingPanel />
              <PositionPanel />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Footer />
    </Flex>
  );
};

Home.getInitialProps = async () => {
  return {};
};

export default Home;
