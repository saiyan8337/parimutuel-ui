import { Story } from "@storybook/react";

import KnowledgePanel from "./KnowledgePanel";

export default {
  title: "Components/KnowledgePanel",
  component: KnowledgePanel,
  parameters: { layout: "centered" },
};

export const Panel: Story = (props) => <KnowledgePanel {...props} />;

Panel.args = {};
