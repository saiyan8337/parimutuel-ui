import { Flex } from "@chakra-ui/react";

import { Story } from "@storybook/react";

import PanelName, { PanelNameProps } from "./PanelName";

export default {
  title: "Components/PanelName",
  component: PanelName,
  parameters: { layout: "centered" },
};

export const Name: Story<PanelNameProps> = (props) => (
  <Flex width="251px">
    <PanelName {...props} />
  </Flex>
);

Name.args = {
  name: "Current Liquidity Pool",
  hasCheckbox: false,
};

export const Checkbox: Story<PanelNameProps> = (props) => (
  <Flex width="251px">
    <PanelName {...props} />
  </Flex>
);

Checkbox.args = {
  name: "My Balance",
  hasCheckbox: true,
};
