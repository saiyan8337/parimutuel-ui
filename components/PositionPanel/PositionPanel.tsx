import React, { useMemo } from "react";
import { MarketStatusEnum } from "@hxronetwork/parimutuelsdk";
import { Flex } from "@chakra-ui/react";

import PanelName from "@components/PanelName/PanelName";
import Position from "@components/Position/Position";
import PositionSelect from "@components/PositionSelect/PositionSelect";
import { useSetting } from "@contexts/setting";
import { usePosition } from "@hooks/usePosition";
import { PositionSummaryOptionEnum } from "@utils/utils";

export const PositionPanel: React.FC = () => {
  const { positionSummaryOption, setPositionSummaryOption } = useSetting();
  const { positions } = usePosition();

  const summaries = useMemo(() => {
    if (positionSummaryOption === PositionSummaryOptionEnum.ALL) {
      return positions.slice(0, 4);
    }

    if (positionSummaryOption === PositionSummaryOptionEnum.LIVE) {
      return positions
        .filter((position) => position.market.status === MarketStatusEnum.LIVE)
        .slice(0, 4);
    }

    return positions
      .filter((position) => position.market.status === MarketStatusEnum.UPCOMING)
      .slice(0, 4);
  }, [positions, positionSummaryOption]);

  return (
    <Flex flexDirection="column" width="251px" height="444px" mt="24px">
      <PanelName name="My Positions Summary" />
      <Flex flexDirection="row" mt="2px" mb="16px">
        <PositionSelect
          label="All"
          isSelected={positionSummaryOption === PositionSummaryOptionEnum.ALL}
          onClick={() => setPositionSummaryOption(PositionSummaryOptionEnum.ALL)}
        />
        <PositionSelect
          label="Live"
          ml="8px"
          isSelected={positionSummaryOption === PositionSummaryOptionEnum.LIVE}
          onClick={() => setPositionSummaryOption(PositionSummaryOptionEnum.LIVE)}
        />
        <PositionSelect
          label="Upcoming"
          ml="8px"
          isSelected={positionSummaryOption === PositionSummaryOptionEnum.UPCOMING}
          onClick={() => setPositionSummaryOption(PositionSummaryOptionEnum.UPCOMING)}
        />
      </Flex>
      {summaries.map((summary, index) => (
        <Position key={summary.time.startTime + index} summary={summary} mb="4px" />
      ))}
    </Flex>
  );
};

export default PositionPanel;
