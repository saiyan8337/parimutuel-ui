import React from "react";

import { Story } from "@storybook/react";

import MarketSelectPanel from "./MarketSelectPanel";

export default {
  title: "Components/MarketSelectPanel",
  component: MarketSelectPanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <MarketSelectPanel {...props} />;

Panel.args = {};
