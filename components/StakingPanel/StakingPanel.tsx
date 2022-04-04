import React from "react";
import { Flex } from "@chakra-ui/react";

import PanelName from "@components/PanelName/PanelName";
import StatsBox from "@components/StatsBox/StatsBox";

export const StakingPanel: React.FC = () => {
  return (
    <Flex flexDirection="column" width="248px" height="140px" mt="24px">
      <PanelName name="My Staking and Rewards" />
      <StatsBox title="Total Value Locked" value="--" mt="4px" />
      <StatsBox title="Yield" value="--" mt="4px" />
      <StatsBox title="My Balance" value="--" mt="4px" />
    </Flex>
  );
};

export default StakingPanel;
