import { Story } from "@storybook/react";

import SettledBoard from "./SettledBoard";

export default {
  title: "Components/SettledBoard",
  component: SettledBoard,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <SettledBoard {...props} />;

Panel.args = {};
