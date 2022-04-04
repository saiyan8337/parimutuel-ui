import { Story } from "@storybook/react";

import Countdown, { CountdownProps } from "./Countdown";

export default {
  title: "Components/Countdown",
  component: Countdown,
  parameters: { layout: "centered" },
};

export const Red: Story<CountdownProps> = (props) => <Countdown {...props} />;

Red.args = {
  endTime: 1632033091,
};

export const Gray: Story<CountdownProps> = (props) => <Countdown {...props} />;

Gray.args = {
  endTime: 1632033091,
};
