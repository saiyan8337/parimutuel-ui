import { Story } from "@storybook/react";

import MarketPanel from "./MarketPanel";

export default {
  title: "Components/MarketPanel",
  component: MarketPanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <MarketPanel {...props} />;

Panel.args = {};
