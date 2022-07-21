import React from "react";
import { DAY_1, HR_1, MarketPairEnum, MIN_1, MIN_5, MIN_15 } from "@hxronetwork/parimutuelsdk";
import useSound from "use-sound";
import { Flex, Image, Text } from "@chakra-ui/react";

import DurationButton from "@components/Button/DurationButton";
import SelectButton from "@components/Button/SelectButton";
import PanelName from "@components/PanelName/PanelName";
import { useSetting } from "@contexts/setting";
import alarmSvg from "@public/images/alarm.svg";
import swapSvg from "@public/images/swap_vert.svg";
import clickSound from "@public/mp3/click.mp3";

export const MarketSelectPanel: React.FC = () => {
  const { selectedDurations, setSelectedDurations, selectedMarketPair, setSelectedMarketPair } =
    useSetting();
  const [play] = useSound(clickSound);

  return (
    <Flex flexDirection="column" width="248px" height="300px">
      <PanelName name="Choose A Market" />
      <Flex flexDirection="column" height="84px" mt="24px">
        <Flex flexDirection="row" alignItems="center">
          <Image src={swapSvg} height="20px" width="20px" ml="16px" alt="swap" />
          <Text textStyle="caption" color="gray.260" ml="8px">
            Select Pair
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          bgColor="brand.300"
          height="56px"
          mt="8px"
        >
          <SelectButton
            label="SOL/USDC"
            value={MarketPairEnum.SOLUSD}
            isSelected={selectedMarketPair === MarketPairEnum.SOLUSD}
            width="123.5px"
            height="56px"
            onClick={() => setSelectedMarketPair(MarketPairEnum.SOLUSD)}
          />
          <SelectButton
            label="BTC/USDC"
            value={MarketPairEnum.BTCUSD}
            isSelected={selectedMarketPair === MarketPairEnum.BTCUSD}
            width="123.5px"
            height="56px"
            onClick={() => setSelectedMarketPair(MarketPairEnum.BTCUSD)}
          />
          <SelectButton
            label="ETH/USDC"
            value={MarketPairEnum.ETHUSD}
            isSelected={selectedMarketPair === MarketPairEnum.ETHUSD}
            width="123.5px"
            height="56px"
            onClick={() => setSelectedMarketPair(MarketPairEnum.ETHUSD)}
          />
        </Flex>
      </Flex>
      <Flex flexDirection="column" height="84px" mt="24px">
        <Flex flexDirection="row" alignItems="center">
          <Image src={alarmSvg} height="20px" width="20px" ml="16px" alt="alarm" />
          <Text textStyle="caption" color="gray.100" ml="8px">
            Select Duration
          </Text>
        </Flex>
        <Flex
          flexDirection="row"
          justifyContent="space-between"
          bgColor="brand.300"
          height="56px"
          mt="8px"
        >
          <DurationButton
            label="1"
            unit="min"
            isSelected={selectedDurations.includes(MIN_1)}
            width="48.8px"
            height="56px"
            onClick={() => {
              play();
              setSelectedDurations(MIN_1);
            }}
          />
          <DurationButton
            label="5"
            unit="min"
            isSelected={selectedDurations.includes(MIN_5)}
            width="48.8px"
            height="56px"
            onClick={() => {
              play();
              setSelectedDurations(MIN_5);
            }}
          />
          <DurationButton
            label="15"
            unit="min"
            isSelected={selectedDurations.includes(MIN_15)}
            width="48.8px"
            height="56px"
            onClick={() => {
              play();
              setSelectedDurations(MIN_15);
            }}
          />
          <DurationButton
            label="1"
            unit="hour"
            isSelected={selectedDurations.includes(HR_1)}
            width="48.8px"
            height="56px"
            onClick={() => {
              play();
              setSelectedDurations(HR_1);
            }}
          />
          <DurationButton
            label="1"
            unit="day"
            isSelected={selectedDurations.includes(DAY_1)}
            width="48.8px"
            height="56px"
            onClick={() => {
              play();
              setSelectedDurations(DAY_1);
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MarketSelectPanel;
