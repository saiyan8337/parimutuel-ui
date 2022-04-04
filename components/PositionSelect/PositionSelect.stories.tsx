import { Story } from "@storybook/react";

import PositionSelect, { PositionSelectProps } from "./PositionSelect";

export default {
  title: "Components/PositionSelect",
  component: PositionSelect,
  parameters: { layout: "centered" },
};

export const All: Story<PositionSelectProps> = (props) => <PositionSelect {...props} />;

All.args = {
  label: "All",
  isSelected: true,
};

export const Upcoming: Story<PositionSelectProps> = (props) => <PositionSelect {...props} />;

Upcoming.args = {
  label: "Upcoming",
};
