import React from "react";
import { MarketStatusEnum } from "@hxronetwork/parimutuelsdk";

import { Story } from "@storybook/react";

import Position, { PositionProps } from "./Position";

export default {
  title: "Components/Position",
  component: Position,
  parameters: { layout: "centered" },
};

export const Live: Story<PositionProps> = (props) => <Position {...props} />;

Live.args = {
  summary: {
    key: {
      parimutuelPubkey: "123",
    },
    market: {
      marketPair: "BTC/USDC",
      status: MarketStatusEnum.LIVE,
      duration: 60,
      isExpired: true,
    },
    time: { startTime: 160434943 },
    pool: { poolSize: 2000, long: 1500, short: 500 },
    position: { long: 500, short: 0 },
    locked: { price: 120 },
    settled: { price: 150 },
  },
};
