import React, { useEffect, useState } from "react";
import { MarketStatusEnum } from "parimutuelsdk";
import { Box, BoxProps } from "@chakra-ui/react";

export type ProgressBarProps = BoxProps & {
  endTime: number;
  duration: number;
  status: MarketStatusEnum;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ endTime, duration, status, ...restProps }) => {
  const [percent, setPercent] = useState(0);

  const getDifference = () => {
    switch (status) {
      case MarketStatusEnum.LIVE:
        return new Date(endTime).getTime() - new Date().getTime();
      case MarketStatusEnum.UPCOMING:
        return new Date(endTime).getTime() - new Date().getTime();
      case MarketStatusEnum.SETTLED:
        return 0;
    }
  };

  const getTotal = () => {
    switch (status) {
      case MarketStatusEnum.LIVE:
        return duration * 1000;
      case MarketStatusEnum.UPCOMING:
        return 60 * 5 * 1000;
      case MarketStatusEnum.SETTLED:
        return 1;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (getDifference() > 0)
      timer = setTimeout(() => {
        setPercent(getDifference() / getTotal());
      }, 1000);
    return () => {
      clearTimeout(timer);
    };
  });

  const getBgColor = () => {
    switch (status) {
      case MarketStatusEnum.LIVE:
        return "purple.300";
      case MarketStatusEnum.UPCOMING:
        return "gray.50";
      case MarketStatusEnum.SETTLED:
        return "transparent";
    }
  };

  return (
    <Box
      position="absolute"
      left="0px"
      bottom="0px"
      height="6px"
      bgColor={getBgColor()}
      width={percent}
      {...restProps}
    />
  );
};

export default ProgressBar;
