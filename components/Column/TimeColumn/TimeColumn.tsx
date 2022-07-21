import React, { memo } from "react";
import { formatDate, formatHour } from "@hxronetwork/parimutuelsdk";
import { Flex, FlexProps, Text } from "@chakra-ui/react";

import Countdown from "@components/Countdown/Countdown";

export type TimeColumnProps = FlexProps & {
  endTime: number;
  showPrefix?: boolean;
  timeType?: "date" | "countdown";
};

export const TimeColumn: React.FC<TimeColumnProps> = ({
  endTime,
  showPrefix = false,
  timeType = "countdown",
  ...restProps
}) => {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="80px"
      borderBottom="1px"
      borderBottomColor="brand.100"
      borderRight="1px"
      borderRightColor="brand.100"
      {...restProps}
    >
      {timeType === "countdown" && showPrefix && (
        <Text textStyle="small" color="white" mr="4px">
          Starts in
        </Text>
      )}
      {timeType === "countdown" && <Countdown endTime={endTime} variant="regular" />}
      {timeType === "date" && (
        <>
          <Text textStyle="small" color="white">
            {formatDate(endTime)}
          </Text>
          <Text textStyle="small" color="white">
            {formatHour(endTime)}
          </Text>
        </>
      )}
    </Flex>
  );
};

export default memo(TimeColumn);
