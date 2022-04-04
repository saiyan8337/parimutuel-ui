import { Button } from "@chakra-ui/react";

import { useModal } from "@contexts/modal";
import { Story } from "@storybook/react";

import PositionModal from "./PositionModal";

export default {
  title: "Components/PositionModal",
  component: PositionModal,
  parameters: { layout: "centered" },
};

export const Modal: Story = () => {
  const { setIsPositionShown } = useModal();

  return (
    <>
      <Button onClick={() => setIsPositionShown(true)}>Open Modal</Button>
      <PositionModal />
    </>
  );
};

Modal.args = {};
