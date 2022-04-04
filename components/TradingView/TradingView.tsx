import React, { useEffect, useMemo } from "react";
import { Box } from "@chakra-ui/react";

import { useSetting } from "@contexts/setting";
import {
  AvailableSaveloadVersions,
  ChartingLibraryWidgetOptions,
  LanguageCode,
  ResolutionString,
  ThemeName,
  widget,
} from "@public/library/charting_library/charting_library";
import { formatMarketPair } from "@utils/utils";

import Datafeed from "./datafeed";

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions["symbol"];
  interval: ChartingLibraryWidgetOptions["interval"];
  datafeedUrl: string;
  libraryPath: ChartingLibraryWidgetOptions["library_path"];
  chartsStorageUrl: ChartingLibraryWidgetOptions["charts_storage_url"];
  chartsStorageApiVersion: ChartingLibraryWidgetOptions["charts_storage_api_version"];
  clientId: ChartingLibraryWidgetOptions["client_id"];
  userId: ChartingLibraryWidgetOptions["user_id"];
  fullscreen: ChartingLibraryWidgetOptions["fullscreen"];
  autosize: ChartingLibraryWidgetOptions["autosize"];
  studiesOverrides: ChartingLibraryWidgetOptions["studies_overrides"];
  container: ChartingLibraryWidgetOptions["container"];
  theme?: "Light" | "Dark";
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp("[\\?&]lang=([^&#]*)");
  const results = regex.exec(location.search); // eslint-disable-line
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, " ")) as LanguageCode);
}

const TradingView: React.FC = () => {
  const { selectedMarketPair } = useSetting();

  const options = useMemo(
    () => ({
      symbol: `Bitfinex:${formatMarketPair(selectedMarketPair)}`,
      interval: "1",
      container: "tv_chart_container",
      libraryPath: "/library/charting_library/",
      chartsStorageUrl: "https://saveload.tradingview.com",
      chartsStorageApiVersion: "1.0",
      clientId: "tradingview.com",
      userId: "public_user_id",
      fullscreen: false,
      autosize: true,
      studiesOverrides: {},
      theme: "Dark",
    }),
    [selectedMarketPair],
  );

  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: options.symbol,
      datafeed: Datafeed as any, // eslint-disable-line
      interval: options.interval as ResolutionString,
      container: options.container,
      library_path: options.libraryPath,
      locale: getLanguageFromURL() || "en",
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: options.chartsStorageUrl,
      charts_storage_api_version: options.chartsStorageApiVersion as AvailableSaveloadVersions,
      client_id: options.clientId,
      user_id: options.userId,
      fullscreen: options.fullscreen,
      autosize: options.autosize,
      studies_overrides: options.studiesOverrides,
      theme: options.theme as ThemeName,
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(() => {
      console.log("Chart ready");
    });

    return () => {
      tvWidget.remove();
    };
  }, [options]);

  return <Box id={options.container as string} height="450px" />;
};

export default TradingView;
