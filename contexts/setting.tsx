import React, { useContext, useState } from "react";
import getConfig from "next/config";
import { ConfigEnum, MarketPairEnum, MIN_1, MIN_5, PositionSideEnum } from "parimutuel-web3";

import { PositionSummaryOptionEnum } from "@utils/utils";

// TODO: make position summary its own context
// We need to add PositionSummaryOptionEnum in the library

const {
  publicRuntimeConfig: { APP_ENV },
} = getConfig();

type SettingContextProps = {
  selectedMarketPair: MarketPairEnum;
  setSelectedMarketPair: (pair: MarketPairEnum) => void;
  selectedDurations: number[];
  setSelectedDurations: (duration: number) => void;
  selectedParimutuel: string;
  setSelectedParimutuel: (parimutuel: string) => void;
  positionSide: PositionSideEnum;
  setPositionSide: (direction: PositionSideEnum) => void;
  positionSummaryOption: PositionSummaryOptionEnum;
  setPositionSummaryOption: (option: PositionSummaryOptionEnum) => void;
};

const defaultContext: SettingContextProps = {
  selectedMarketPair: MarketPairEnum.SOLUSD,
  selectedDurations: [APP_ENV === ConfigEnum.DEV ? MIN_1 : MIN_5],
  selectedParimutuel: "",
  positionSide: PositionSideEnum.LONG,
  positionSummaryOption: PositionSummaryOptionEnum.ALL,
  setSelectedMarketPair: () => null,
  setSelectedDurations: () => null,
  setSelectedParimutuel: () => null,
  setPositionSide: () => null,
  setPositionSummaryOption: () => null,
};

export const SettingContext = React.createContext<SettingContextProps>(defaultContext);

export const SettingProvider: React.FC = ({ children }) => {
  const [selectedMarketPair, setSelectedMarketPair] = useState<MarketPairEnum>(
    defaultContext.selectedMarketPair,
  );
  const [selectedDurations, setSelectedDurations] = useState<number[]>(
    defaultContext.selectedDurations,
  );
  const [selectedParimutuel, setSelectedParimutuel] = useState<string>(
    defaultContext.selectedParimutuel,
  );
  const [positionSide, setPositionSide] = useState<PositionSideEnum>(defaultContext.positionSide);
  const [positionSummaryOption, setPositionSummaryOption] = useState<PositionSummaryOptionEnum>(
    defaultContext.positionSummaryOption,
  );

  const selectDurations = (duration: number) => {
    if (selectedDurations.includes(duration)) {
      if (selectedDurations.length === 1) return;
      const filtered = selectedDurations.filter(
        (selectedDuration) => selectedDuration !== duration,
      );

      setSelectedDurations(filtered);
    } else {
      setSelectedDurations([...selectedDurations, duration]);
    }
  };

  return (
    <SettingContext.Provider
      value={{
        ...defaultContext,
        selectedMarketPair,
        setSelectedMarketPair,
        selectedDurations,
        setSelectedDurations: selectDurations,
        selectedParimutuel,
        setSelectedParimutuel,
        positionSide,
        setPositionSide,
        positionSummaryOption,
        setPositionSummaryOption,
      }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = (): SettingContextProps => {
  const context = useContext(SettingContext);
  if (context === undefined) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
};
