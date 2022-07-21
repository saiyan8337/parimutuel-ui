import React, { useMemo } from "react";
import { calculateOdd, MarketStatusEnum } from "parimutuelsdk";
import { Flex, FlexProps, Image, Text } from "@chakra-ui/react";

import Countdown from "@components/Countdown/Countdown";
import ProgressBar from "@components/ProgressBar/ProgressBar";
import { PositionItem } from "@hooks/usePosition";
import downArrowSvg from "@public/images/arrow_down.svg";
import upArrowSvg from "@public/images/arrow_up.svg";

export type PositionProps = FlexProps & {
  summary: PositionItem;
};

export const Position: React.FC<PositionProps> = ({ summary, ...restProps }) => {
  const {
    market: { marketPair, status, duration, isExpired },
    time: { startTime },
    pool: { poolSize, long: longPool, short: shortPool },
    position: { long, short },
    locked: { price: lockedPrice },
    settled: { price: settledPrice },
  } = summary;

  const isLong = long > 0;
  const enteredPosition = isLong ? long : short;
  const positionSize = isLong ? longPool : shortPool;
  const countdownTime =
    status === MarketStatusEnum.UPCOMING ? startTime : startTime + duration * 1000;

  const payout = useMemo(() => {
    // short position win
    if (lockedPrice >= settledPrice && short && shortPool) {
      return (short / shortPool) * poolSize;
    }

    if (lockedPrice < settledPrice && long && longPool) {
      // long position win
      return (long / longPool) * poolSize;
    }
  }, [lockedPrice, settledPrice, short, long, poolSize, longPool, shortPool]);

  const renderCountdown = useMemo(() => {
    if (!isExpired) {
      return <Countdown endTime={countdownTime} variant="warning" />;
    }

    if (long || short) {
      return (
        <Text textStyle="small" color="white">
          {long
            ? lockedPrice > settledPrice
              ? "OTM"
              : "-"
            : settledPrice > lockedPrice
            ? "OTM"
            : "-"}
        </Text>
      );
    }

    return (
      <Text textStyle="small" color="white">
        {short || long ? (payout ? `$${payout.toFixed(0)}` : "OTM") : "-"}
      </Text>
    );
  }, [payout, lockedPrice, long, short, settledPrice, countdownTime, isExpired]);

  return (
    <Flex
      bgColor="brand.100"
      width="250px"
      height="86px"
      borderRadius="4px"
      position="relative"
      overflow="hidden"
      {...restProps}
    >
      <Flex flexDirection="column" justifyContent="flex-start" width="100%" padding="8px">
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text textStyle="small" color="gray.260">
            {marketPair}
          </Text>
          {renderCountdown}
        </Flex>
        <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
          <Flex>
            <Flex
              paddingX="4px"
              height="24px"
              borderRadius="4px"
              bgColor="brand.400"
              alignItems="center"
              justifyContent="center"
            >
              <Image
                height="20px"
                width="20px"
                src={isLong ? upArrowSvg : downArrowSvg}
                alt="arrow"
              />
              <Text textStyle="caption" color="gray.260">
                {enteredPosition}
              </Text>
            </Flex>
          </Flex>
          <Flex paddingY="3px">
            <Text textStyle="caption" color="gray.400">
              Locked Price
            </Text>
            <Text textStyle="caption" color="gray.260" ml="4px">
              {lockedPrice && status !== MarketStatusEnum.UPCOMING ? `$${lockedPrice}` : "-"}
            </Text>
          </Flex>
        </Flex>
        <Flex justifyContent="flex-end" align="center" paddingY="3px">
          <Text textStyle="caption" color="gray.400">
            Pool Size
          </Text>
          <Text textStyle="caption" color="gray.260" ml="4px">
            {`$${poolSize}/${calculateOdd(positionSize, poolSize)}X`}
          </Text>
        </Flex>
      </Flex>
      <ProgressBar endTime={startTime} duration={duration} status={status} />
    </Flex>
  );
};

export default Position;
