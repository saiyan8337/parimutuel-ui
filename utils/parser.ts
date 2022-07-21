import { decodeAccount, decodeMint, TokenAccount } from "@hxronetwork/parimutuelsdk";
import { AccountInfo } from "@solana/web3.js";

export interface ParsedAccountBase {
  pubkey: string;
  account: AccountInfo<Buffer>;
  info: any; // eslint-disable-line
}

export type AccountParser = (
  pubkey: string,
  data: AccountInfo<Buffer>,
) => ParsedAccountBase | undefined;

export interface ParsedAccount<T> extends ParsedAccountBase {
  info: T;
}

export const MintParser = (pubKey: string, info: AccountInfo<Buffer>) => {
  const buffer = Buffer.from(info.data);

  const data = decodeMint(buffer);

  const details = {
    pubkey: pubKey,
    account: {
      ...info,
    },
    info: data,
  } as ParsedAccountBase;

  return details;
};

export const TokenAccountParser = (pubKey: string, info: AccountInfo<Buffer>) => {
  // Sometimes a wrapped sol account gets closed, goes to 0 length,
  // triggers an update over wss which triggers this guy to get called
  // since your UI already logged that pubkey as a token account. Check for length.
  if (info.data.length > 0) {
    const buffer = Buffer.from(info.data);
    const data = decodeAccount(buffer);

    const details = {
      pubkey: pubKey,
      account: {
        ...info,
      },
      info: data,
    } as TokenAccount;

    return details;
  }
};

export const GenericAccountParser = (pubKey: string, info: AccountInfo<Buffer>) => {
  const buffer = Buffer.from(info.data);

  const details = {
    pubkey: pubKey,
    account: {
      ...info,
    },
    info: buffer,
  } as ParsedAccountBase;

  return details;
};
