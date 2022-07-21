import React, { useMemo } from "react";
import { Column, useSortBy, useTable } from "react-table";
import { getMarketPubkeys } from "parimutuelsdk";
import { Flex, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";

import ActionColumn from "@components/Column/ActionColumn/ActionColumn";
import KeyColumn from "@components/Column/KeyColumn/KeyColumn";
import MarketColumn from "@components/Column/MarketColumn/MarketColumn";
import MyPositionColumn from "@components/Column/MyPositionColumn/MyPositionColumn";
import PoolSizeColumn from "@components/Column/PoolSizeColumn/PoolSizeColumn";
import TimeColumn from "@components/Column/TimeColumn/TimeColumn";
import Sort from "@components/Sort/Sort";
import { getWeb3Config } from "@constants/config";
import { useSetting } from "@contexts/setting";
import { MarketBoardItem, useMarket } from "@hooks/useMarket";

const columns: Column<MarketBoardItem>[] = [
  {
    Header: "ID",
    accessor: "key",
    Cell: ({ cell: { value } }) => <KeyColumn pubkey={value.parimutuelPubkey} />,
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].parimutuelPubkey;
      const b = rowB.values[columnId].parimutuelPubkey;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "MARKET",
    accessor: "market",
    Cell: ({ cell: { value } }) => (
      <MarketColumn cryptoPair={value.marketPair} duration={value.duration} />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].marketPair;
      const b = rowB.values[columnId].marketPair;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "TIME",
    accessor: "time",
    Cell: ({ cell: { value } }) => <TimeColumn endTime={value.startTime} showPrefix />,
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].startTime;
      const b = rowB.values[columnId].startTime;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "POOL SIZE",
    accessor: "pool",
    Cell: ({ cell: { value } }) => (
      <PoolSizeColumn poolSize={value.poolSize} long={value.long} short={value.short} />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].poolSize;
      const b = rowB.values[columnId].poolSize;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "My Positions",
    accessor: "position",
    Cell: ({ cell: { value } }) => (
      <MyPositionColumn long={value.long || undefined} short={value.short || undefined} />
    ),
    sortType: (rowA, rowB, columnId) => {
      const a = rowA.values[columnId].long;
      const b = rowB.values[columnId].long;
      return a > b ? 1 : -1;
    },
  },
  {
    Header: "LONG/SHORT",
    accessor: "payout",
    disableSortBy: true,
    Cell: ({ cell: { value } }) => {
      return <ActionColumn parimutuelKey={value.parimutuelPubkey} />;
    },
  },
];

const OpenBoard = () => {
  const { selectedDurations, selectedMarketPair } = useSetting();
  const { upcomingParimutuels } = useMarket();

  const data = useMemo(() => {
    const markets = getMarketPubkeys(getWeb3Config(), selectedMarketPair);
    const marketPubkeys = markets
      .filter((market) => selectedDurations.includes(market.duration))
      .map((market) => market.pubkey.toBase58());
    return upcomingParimutuels.filter((market) => marketPubkeys.includes(market.key.marketPubkey));
  }, [upcomingParimutuels, selectedDurations, selectedMarketPair]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
  );

  const getWidth = (index: number): string => {
    if (index === 3) return "25%";
    return "15%";
  };

  return (
    <Table {...getTableProps()}>
      <Thead>
        {headerGroups.map((headerGroup) => {
          const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
          return (
            <Tr key={key} {...restHeaderGroupProps}>
              {headerGroup.headers.map((column, index) => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  paddingX="1px"
                  paddingY="0px"
                  width={getWidth(index)}
                  height="26px"
                  border="0px"
                  key={index}
                >
                  <Flex
                    paddingY="4px"
                    bgColor="brand.100"
                    width="100%"
                    height="100%"
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Text textStyle="table" color="gray.400">
                      {column.Header}
                    </Text>
                    <Sort column={column} />
                  </Flex>
                </Th>
              ))}
            </Tr>
          );
        })}
      </Thead>
      <Tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          const { key, ...restRowProps } = row.getRowProps();
          return (
            <Tr key={key} {...restRowProps}>
              {row.cells.map((cell) => {
                const { key, ...restCellProps } = cell.getCellProps();
                return (
                  <Td key={key} {...restCellProps} textAlign="center" padding="0px" border="0px">
                    {cell.render("Cell")}
                  </Td>
                );
              })}
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
};

export default OpenBoard;
