import React from "react";

import { Story } from "@storybook/react";

import PositionPanel from "./PositionPanel";

export default {
  title: "Components/PositionPanel",
  component: PositionPanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <PositionPanel {...props} />;

Panel.args = {};
