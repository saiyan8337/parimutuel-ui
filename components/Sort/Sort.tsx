import React from "react";
import { HeaderGroup } from "react-table";
import { Image, ImageProps } from "@chakra-ui/react";

import sortDownSvg from "@public/images/sort_down.svg";
import sortUpSvg from "@public/images/sort_up.svg";
import unsortSvg from "@public/images/unsort.svg";

export type SortProps = ImageProps & {
  column: HeaderGroup<any>; // eslint-disable-line
};

export const Sort: React.FC<SortProps> = ({ column, ...restProps }) => {
  return column.disableSortBy ? (
    <></>
  ) : (
    <Image
      {...restProps}
      height="16px"
      width="16px"
      ml="4px"
      mb="3px"
      src={column.isSorted ? (column.isSortedDesc ? sortDownSvg : sortUpSvg) : unsortSvg}
      alt="sort"
    />
  );
};

export default Sort;
