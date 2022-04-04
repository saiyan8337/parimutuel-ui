import React, { useMemo } from "react";
import { Flex, FlexProps, Text } from "@chakra-ui/react";

import SettleParimutuelPositionButton from "@components/Button/SettlePositionButton";
import UpdatePriceButton from "@components/Button/UpdatePriceButton";
import { useParimutuel } from "@contexts/parimutuel";

export type PayoutColumnProps = FlexProps & {
  long?: number;
  short?: number;
  longPool: number;
  shortPool: number;
  lockedPrice: number;
  settledPrice: number;
  showSettle: boolean;
  parimutuelPubkey: string;
  isExpired: boolean;
};

export const PayoutColumn: React.FC<PayoutColumnProps> = ({
  long,
  short,
  longPool,
  shortPool,
  lockedPrice,
  settledPrice,
  showSettle,
  parimutuelPubkey,
  isExpired,
  ...restProps
}) => {
  const { settled } = useParimutuel();
  const totalPool = shortPool + longPool;

  const payout = useMemo(() => {
    // short position win
    if (lockedPrice >= settledPrice && short && shortPool) {
      return (short / shortPool) * totalPool;
    }

    if (lockedPrice < settledPrice && long && longPool) {
      // long position win
      return (long / longPool) * totalPool;
    }
  }, [lockedPrice, settledPrice, short, long, totalPool, longPool, shortPool]);

  const renderSettleButton = useMemo(() => {
    if (!showSettle)
      return (
        <Text textStyle="small" color="white">
          {short || long ? (payout ? `$${payout.toFixed(0)}` : "OTM") : "-"}
        </Text>
      );

    if (!isExpired && payout) return <UpdatePriceButton parimutuelPubkey={parimutuelPubkey} />;

    if (isExpired && payout && !settled?.includes(parimutuelPubkey)) {
      return <SettleParimutuelPositionButton parimutuelPubkey={parimutuelPubkey} />;
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
  }, [
    isExpired,
    showSettle,
    payout,
    settled,
    lockedPrice,
    long,
    short,
    parimutuelPubkey,
    settledPrice,
  ]);

  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="80px"
      borderBottom="1px"
      borderBottomColor="brand.100"
      {...restProps}
    >
      {renderSettleButton}
    </Flex>
  );
};

export default PayoutColumn;
