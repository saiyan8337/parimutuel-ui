import React from "react";
import { Flex } from "@chakra-ui/react";

import PanelName from "@components/PanelName/PanelName";
import StatsBox from "@components/StatsBox/StatsBox";

export const LiquidityPanel: React.FC = () => {
  return (
    <Flex flexDirection="column" width="248px" height="272px" mt="12px">
      <PanelName name="Current Liquidity Pool" />
      <StatsBox title="Total Staked" value="$ --" direction="vertical" />
      <StatsBox title="24h Volume (1min)" value="$ --" mt="4px" direction="vertical" />
      <StatsBox title="24h Total Fees (1min)" value="$ --" mt="4px" direction="vertical" />
      <StatsBox title="Current APY" value="--%" mt="4px" direction="vertical" />
    </Flex>
  );
};

export default LiquidityPanel;
