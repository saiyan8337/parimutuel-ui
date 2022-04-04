import React from "react";

import { Story } from "@storybook/react";

import LiquidityPanel from "./LiquidityPanel";

export default {
  title: "Components/LiquidityPanel",
  component: LiquidityPanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <LiquidityPanel {...props} />;

Panel.args = {};
