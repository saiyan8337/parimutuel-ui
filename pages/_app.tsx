import { ReactNode } from "react";
import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import Script from "next/script";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

import { AccountsProvider } from "@contexts/accounts";
import { ConfettiProvider } from "@contexts/confetti";
import { GeoProvider } from "@contexts/geo";
import { ModalProvider } from "@contexts/modal";
import { ParimutuelProvider } from "@contexts/parimutuel";
import { PythProvider } from "@contexts/pyth";
import { SettingProvider } from "@contexts/setting";
import { TokenProvider } from "@contexts/token";
import { WhitelistProvider } from "@contexts/whitelist";
import theme from "@theme/theme";

import "@fontsource/open-sans";
import "@fontsource/roboto";
import "@fontsource/sora";

const WalletConnectionProvider = dynamic<{ children: ReactNode }>(
  () => import("@contexts/wallet").then(({ WalletConnectionProvider }) => WalletConnectionProvider),
  {
    ssr: false,
  },
);

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <ChakraProvider theme={theme}>
      <GeoProvider>
        <WhitelistProvider>
          <SettingProvider>
            <TokenProvider>
              <WalletConnectionProvider>
                <PythProvider>
                  <AccountsProvider>
                    <ConfettiProvider>
                      <ParimutuelProvider>
                        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                        <ModalProvider>
                          <Script src="/static/datafeeds/udf/dist/polyfills.js" />
                          <Script src="/static/datafeeds/udf/dist/bundle.js" />
                          <Component {...pageProps} />;
                        </ModalProvider>
                      </ParimutuelProvider>
                    </ConfettiProvider>
                  </AccountsProvider>
                </PythProvider>
              </WalletConnectionProvider>
            </TokenProvider>
          </SettingProvider>
        </WhitelistProvider>
      </GeoProvider>
    </ChakraProvider>
  );
};

export default MyApp;
