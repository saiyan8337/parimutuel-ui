import { decodeMint, TokenAccount } from "@hxronetwork/parimutuelsdk";
import { MintInfo } from "@solana/spl-token";
import { Connection, PublicKey } from "@solana/web3.js";

import BN from "bn.js";

export const getMintInfo = async (connection: Connection, pubKey: PublicKey) => {
  const info = await connection.getAccountInfo(pubKey);
  if (info === null) {
    throw new Error("Failed to find mint account");
  }

  const data = Buffer.from(info.data);
  return decodeMint(data);
};

export const toLamports = (account?: TokenAccount | number, mint?: MintInfo): number => {
  if (!account) {
    return 0;
  }

  const amount = typeof account === "number" ? account : account.info.amount?.toNumber();
  const precision = Math.pow(10, mint?.decimals || 0);
  return Math.floor(amount * precision);
};

export const fromLamports = (
  account?: TokenAccount | number | BN,
  mint?: MintInfo,
  rate = 1.0,
): number => {
  if (!account) {
    return 0;
  }

  const amount = Math.floor(
    typeof account === "number"
      ? account
      : BN.isBN(account)
      ? account.toNumber()
      : account.info.amount.toNumber(),
  );

  const precision = Math.pow(10, mint?.decimals || 9);
  return (amount / precision) * rate;
};
