import { Story } from "@storybook/react";

import ConnectButton, { ConnectButtonProps } from "./ConnectButton";
import SelectButton, { SelectButtonProps } from "./SelectButton";

export default {
  title: "Components/Button",
  component: SelectButton,
  parameters: { layout: "centered" },
};

export const Select: Story<SelectButtonProps> = (props) => <SelectButton {...props} />;

Select.args = {
  label: "Parimutuel",
  isSelected: true,
};

export const Connect: Story<ConnectButtonProps> = (props) => <ConnectButton {...props} />;

Connect.args = {};
