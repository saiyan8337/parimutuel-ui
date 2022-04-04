import React from "react";

import { Story } from "@storybook/react";

import StatsBox, { StatsBoxProps } from "./StatsBox";

export default {
  title: "Components/StatsBox",
  component: StatsBox,
  parameters: { layout: "centered" },
};

export const Stats: Story<StatsBoxProps> = (props) => <StatsBox {...props} />;

Stats.args = {
  title: "Total Value",
  value: "$ 1.999",
};
