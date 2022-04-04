import React from "react";
import { Flex } from "@chakra-ui/react";

import PanelName from "@components/PanelName/PanelName";
import StatsBox from "@components/StatsBox/StatsBox";
import { useParimutuel } from "@contexts/parimutuel";

export const GlobalStatsPanel: React.FC = () => {
  const { protocolFeeAmount, settlementFeeAmount } = useParimutuel();

  return (
    <Flex flexDirection="column" width="248px" height="212px" mt="24px">
      <PanelName name="Global Stats (Parimutuel)" />
      <StatsBox
        title="Global Tx Fee Paid - HXRO"
        value={Number(protocolFeeAmount / 10 ** 9).toFixed(3)}
        direction="vertical"
        mt="4px"
      />
      <StatsBox
        title="Global Tx Fee Paid - USDC"
        value={Number(settlementFeeAmount / 10 ** 9).toFixed(3)}
        direction="vertical"
        mt="4px"
      />
    </Flex>
  );
};

export default GlobalStatsPanel;
