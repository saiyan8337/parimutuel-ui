import { Story } from "@storybook/react";

import BalancePanel from "./BalancePanel";

export default {
  title: "Components/BalancePanel",
  component: BalancePanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <BalancePanel {...props} />;

Panel.args = {};
