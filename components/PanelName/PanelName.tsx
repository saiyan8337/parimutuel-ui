import React from "react";
import { Checkbox, Flex, FlexProps, Image, Text, Tooltip } from "@chakra-ui/react";

import faqSvg from "@public/images/faq.svg";

export type PanelNameProps = FlexProps & {
  name: string;
  hasCheckbox?: boolean;
  hasTooltip?: boolean;
  tips?: string;
};

export const PanelName: React.FC<PanelNameProps> = ({
  name,
  hasCheckbox,
  hasTooltip,
  tips,
  ...restProps
}) => {
  return (
    <Flex
      flexDirection="row"
      height="35px"
      mb="8px"
      width="100%"
      alignItems="center"
      justifyContent={hasTooltip ? "flex-start" : "space-between"}
      {...restProps}
    >
      <Text textStyle="accent" color="gray.260">
        {name}
      </Text>
      {hasCheckbox && (
        <Flex flexDirection="row" alignItems="center">
          <Checkbox iconColor="green.400" size="sm" defaultIsChecked isDisabled />
          <Text textStyle="caption" color="gray.50" ml="4px">
            Pay fee with HXRO
          </Text>
        </Flex>
      )}
      {hasTooltip && (
        <Tooltip hasArrow label={tips} bg="gray.300" color="black">
          <Image ml="8px" height="16px" width="16px" src={faqSvg} alt="faq" />
        </Tooltip>
      )}
    </Flex>
  );
};

export default PanelName;
