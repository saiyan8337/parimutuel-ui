import { useAccountsContext } from "@contexts/accounts";
import { TokenAccount } from "parimutuel-web3";

export const useAccounts = (): {
  userAccounts: TokenAccount[];
  accountByMint: Map<string, TokenAccount>;
} => {
  const { userAccounts } = useAccountsContext();

  const accountByMint = userAccounts?.reduce(
    (prev: Map<string, TokenAccount>, acc: TokenAccount) => {
      prev.set(acc.info.mint.toBase58(), acc);
      return prev;
    },
    new Map<string, TokenAccount>(),
  );

  return {
    userAccounts: userAccounts as TokenAccount[],
    accountByMint,
  };
};
