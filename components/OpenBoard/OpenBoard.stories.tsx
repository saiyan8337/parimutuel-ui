import { Story } from "@storybook/react";

import OpenBoard from "./OpenBoard";

export default {
  title: "Components/OpenBoard",
  component: OpenBoard,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <OpenBoard {...props} />;

Panel.args = {};
