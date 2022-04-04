import React from "react";

import { Story } from "@storybook/react";

import StakingPanel from "./StakingPanel";

export default {
  title: "Components/StakingPanel",
  component: StakingPanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <StakingPanel {...props} />;

Panel.args = {};
