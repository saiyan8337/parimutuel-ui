import React, { useEffect, useState } from "react";
import { Text, TextProps } from "@chakra-ui/react";

export type CountdownProps = TextProps & {
  endTime: number;
  variant: "regular" | "warning";
};

const Countdown: React.FC<CountdownProps> = ({ endTime, variant, ...restProps }) => {
  const difference = new Date(endTime).getTime() - new Date().getTime();

  const calculateTimeLeft = () => {
    let timeLeft: { hours: string; minutes: string; seconds: string } = {
      hours: "00",
      minutes: "00",
      seconds: "00",
    };

    let hours = Math.floor(difference / (1000 * 60 * 60)).toString();
    let minutes = Math.floor((difference / 1000 / 60) % 60).toString();
    let seconds = Math.floor((difference / 1000) % 60).toString();

    const numbersToAddZeroTo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    if (numbersToAddZeroTo.includes(parseInt(hours))) {
      hours = `0${hours}`;
    }

    if (numbersToAddZeroTo.includes(parseInt(minutes))) {
      minutes = `0${minutes}`;
    }

    if (numbersToAddZeroTo.includes(parseInt(seconds))) {
      seconds = `0${seconds}`;
    }

    if (difference > 0) {
      timeLeft = {
        hours,
        minutes,
        seconds,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (difference > 0)
      timer = setTimeout(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);

    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <Text
      textStyle={variant === "regular" ? "small" : "timer"}
      color={variant === "regular" ? "white" : "red.400"}
      {...restProps}
    >
      {`${timeLeft.hours}:${timeLeft.minutes}:${timeLeft.seconds}`}
    </Text>
  );
};

export default Countdown;
