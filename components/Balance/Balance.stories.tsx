import React from "react";
import { CryptoEnum } from "@hxronetwork/parimutuelsdk";

import { Story } from "@storybook/react";

import Balance, { BalanceProps } from "./Balance";

export default {
  title: "Components/Balance",
  component: Balance,
  parameters: { layout: "centered" },
};

export const Solana: Story<BalanceProps> = (props) => <Balance {...props} />;

Solana.args = {
  crypto: CryptoEnum.SOLANA,
  fiatAmount: "1,999.00",
  cryptoAmount: "1.234567",
};

export const USDC: Story<BalanceProps> = (props) => <Balance {...props} />;

USDC.args = {
  crypto: CryptoEnum.USDC,
  fiatAmount: "1,999.00",
  cryptoAmount: "1.234567",
};

export const HXRO: Story<BalanceProps> = (props) => <Balance {...props} />;

HXRO.args = {
  crypto: CryptoEnum.HXRO,
  fiatAmount: "1,999.00",
  cryptoAmount: "1.234567",
};
