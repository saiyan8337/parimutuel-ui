import React, { Suspense, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { getMarketPubkeys } from "@hxronetwork/parimutuelsdk";
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";

import Loader from "@components/Loader/Loader";
import { getWeb3Config } from "@constants/config";
import { useSetting } from "@contexts/setting";
import { useMarket } from "@hooks/useMarket";

const OpenBoard = dynamic(() => import("@components/OpenBoard/OpenBoard"));
const LiveBoard = dynamic(() => import("@components/LiveBoard/LiveBoard"));
const SettledBoard = dynamic(() => import("@components/SettledBoard/SettledBoard"));

export const MarketPanel: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const { selectedDurations, selectedMarketPair } = useSetting();
  const { liveParimutuels } = useMarket();
  const markets = getMarketPubkeys(getWeb3Config(), selectedMarketPair);

  const marketPubkeys = useMemo(
    () =>
      markets
        .filter((market) => selectedDurations.includes(market.duration))
        .map((market) => market.pubkey.toBase58()),
    [selectedDurations, markets],
  );

  const livePositions = useMemo(() => {
    return liveParimutuels
      .filter((parimutuel) => marketPubkeys.includes(parimutuel.key.marketPubkey))
      .filter((market) => market.position.long + market.position.short > 0);
  }, [liveParimutuels, marketPubkeys]);

  return (
    <Box mt="15px">
      <Tabs minWidth="960px" variant="unstyled" isFitted onChange={(index) => setTabIndex(index)}>
        <TabList backgroundColor="brand.100" borderBottom="1px" borderColor="green.200">
          <Tab borderBottom="1px" borderColor={tabIndex === 0 ? "green.400" : "gray.400"}>
            <Text textStyle="accent" color={tabIndex === 0 ? "green.400" : "gray.400"}>
              Open
            </Text>
          </Tab>
          <Tab borderBottom="1px" borderColor={tabIndex === 1 ? "green.400" : "gray.400"}>
            <Text textStyle="accent" color={tabIndex === 1 ? "green.400" : "gray.400"}>
              {`Live (${livePositions.length})`}
            </Text>
          </Tab>
          <Tab borderBottom="1px" borderColor={tabIndex === 2 ? "green.400" : "gray.400"}>
            <Text textStyle="accent" color={tabIndex === 2 ? "green.400" : "gray.400"}>
              Settled
            </Text>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel padding="0px">
            <OpenBoard />
          </TabPanel>
          <TabPanel padding="0px">
            <Suspense fallback={<Loader />}>
              <LiveBoard />
            </Suspense>
          </TabPanel>
          <TabPanel padding="0px">
            <Suspense fallback={<Loader />}>
              <SettledBoard />
            </Suspense>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default MarketPanel;
