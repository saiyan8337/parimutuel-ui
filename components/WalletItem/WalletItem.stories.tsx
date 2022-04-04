import { WalletName } from "@solana/wallet-adapter-wallets";

import { Story } from "@storybook/react";

import WalletItem, { WalletItemProps } from "./WalletItem";

export default {
  title: "Components/WalletItem",
  component: WalletItem,
  parameters: { layout: "centered" },
};

export const Wallet: Story<WalletItemProps> = (props) => <WalletItem {...props} />;

Wallet.args = {
  wallet: {
    name: WalletName.Sollet,
    url: "https://www.sollet.io",
    icon: "https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets/sollet.svg",
    adapter: {} as any, // eslint-disable-line
  },
};
