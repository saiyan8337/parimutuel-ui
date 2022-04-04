import { Story } from "@storybook/react";

import GlobalStatsPanel from "./GlobalStatsPanel";

export default {
  title: "Components/GlobalStatsPanel",
  component: GlobalStatsPanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <GlobalStatsPanel {...props} />;

Panel.args = {};
