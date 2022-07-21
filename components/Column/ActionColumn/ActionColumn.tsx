import React, { useCallback } from "react";
import { PositionSideEnum } from "@hxronetwork/parimutuelsdk";
import useSound from "use-sound";
import { Box, Flex, FlexProps, Image } from "@chakra-ui/react";

import { useModal } from "@contexts/modal";
import { useSetting } from "@contexts/setting";
import { useBlock } from "@hooks/useBlock";
import downArrowSvg from "@public/images/arrow_down_white.svg";
import upArrowSvg from "@public/images/arrow_up_white.svg";
import clickSound from "@public/mp3/click.mp3";

export type ActionColumnProps = FlexProps & {
  parimutuelKey: string;
};

export const ActionColumn: React.FC<ActionColumnProps> = ({ parimutuelKey, ...restProps }) => {
  const { setSelectedParimutuel, setPositionSide } = useSetting();
  const { isBlocked, setModal } = useBlock();
  const { setIsPositionShown } = useModal();

  const [play] = useSound(clickSound);

  const handleClick = useCallback(
    (isLong: boolean) => {
      play();

      if (isBlocked) {
        setModal && setModal(true);
        return;
      }

      setSelectedParimutuel(parimutuelKey);
      setPositionSide(isLong ? PositionSideEnum.LONG : PositionSideEnum.SHORT);
      setIsPositionShown(true);
    },
    [
      play,
      isBlocked,
      setModal,
      setSelectedParimutuel,
      parimutuelKey,
      setPositionSide,
      setIsPositionShown,
    ],
  );

  return (
    <Flex
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      height="80px"
      px="10px"
      borderBottom="1px"
      borderBottomColor="brand.100"
      {...restProps}
    >
      <Box
        as="button"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="45%"
        height="35%"
        boxSizing="border-box"
        borderRadius="4px"
        bg="green.400"
        _hover={{ bgColor: "brand.300" }}
        onClick={() => handleClick(true)}
      >
        <Image height="20px" width="20px" src={upArrowSvg} alt="up arrow" />
      </Box>
      <Box
        as="button"
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="45%"
        height="35%"
        boxSizing="border-box"
        borderRadius="4px"
        bg="red.300"
        _hover={{ bgColor: "brand.300" }}
        onClick={() => handleClick(false)}
      >
        <Image height="20px" width="20px" src={downArrowSvg} alt="down arrow" />
      </Box>
    </Flex>
  );
};

export default ActionColumn;
