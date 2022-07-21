import React, { useCallback, useContext, useEffect, useState } from "react";
import { decodeAccount, decodeMint, TokenAccount } from "@hxronetwork/parimutuelsdk";
import { AccountLayout, MintInfo, TOKEN_PROGRAM_ID, u64 } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AccountInfo, Connection, PublicKey } from "@solana/web3.js";

import { EventEmitter } from "@utils/eventEmitter";
import { getMintInfo } from "@utils/mint";
import { AccountParser, ParsedAccountBase, TokenAccountParser } from "@utils/parser";

type AccountsContextProps = {
  userAccounts: TokenAccount[];
  nativeAccount: AccountInfo<Buffer> | undefined;
};

const defaultContext: AccountsContextProps = {
  userAccounts: [],
  nativeAccount: undefined,
};

const AccountsContext = React.createContext<AccountsContextProps>(defaultContext);

const pendingCalls = new Map<string, Promise<ParsedAccountBase>>();
const genericCache = new Map<string, ParsedAccountBase>();
const pendingMintCalls = new Map<string, Promise<MintInfo>>();
const mintCache = new Map<string, MintInfo>();

// TODO: return from tokenMap
const SOL_MINT = new PublicKey("So11111111111111111111111111111111111111112");

export const accountParserMap = new Map<string, AccountParser>();

export const cache = {
  emitter: new EventEmitter(),
  query: async (connection: Connection, pubKey: string | PublicKey, parser?: AccountParser) => {
    let id: PublicKey;
    if (typeof pubKey === "string") {
      id = new PublicKey(pubKey);
    } else {
      id = pubKey;
    }

    const address = id.toBase58();

    const account = genericCache.get(address);
    if (account) {
      return account;
    }

    let query = pendingCalls.get(address);
    if (query) {
      return query;
    }

    // TODO: refactor to use multiple accounts query with flush like behavior
    query = connection.getAccountInfo(id).then((data) => {
      if (!data) {
        throw new Error("Account not found");
      }

      return cache.add(id, data, parser);
    }) as Promise<TokenAccount>;
    pendingCalls.set(address, query as any); // eslint-disable-line

    return query;
  },
  add: (
    id: PublicKey | string,
    obj: AccountInfo<Buffer>,
    parser?: AccountParser,
    isActive?: boolean | undefined | ((parsed: any) => boolean), // eslint-disable-line
  ) => {
    const address = typeof id === "string" ? id : id?.toBase58();
    const deserialize = parser ? parser : accountParserMap.get(address);
    if (!deserialize) {
      throw new Error("Deserializer needs to be registered or passed as a parameter");
    }

    cache.registerParser(id, deserialize);
    pendingCalls.delete(address);
    const account = deserialize(address, obj);
    if (!account) {
      return;
    }

    if (isActive === undefined) isActive = true;
    else if (isActive instanceof Function) isActive = isActive(account);

    const isNew = !genericCache.has(address);

    genericCache.set(address, account);
    cache.emitter.raiseCacheUpdated(address, isNew, deserialize, isActive);
    return account;
  },
  get: (pubKey: string | PublicKey) => {
    let key: string;
    if (typeof pubKey !== "string") {
      key = pubKey.toBase58();
    } else {
      key = pubKey;
    }

    return genericCache.get(key);
  },
  delete: (pubKey: string | PublicKey) => {
    let key: string;
    if (typeof pubKey !== "string") {
      key = pubKey.toBase58();
    } else {
      key = pubKey;
    }

    if (genericCache.get(key)) {
      genericCache.delete(key);
      cache.emitter.raiseCacheDeleted(key);
      return true;
    }
    return false;
  },
  byParser: (parser: AccountParser) => {
    const result: string[] = [];
    for (const id of accountParserMap.keys()) {
      if (accountParserMap.get(id) === parser) {
        result.push(id);
      }
    }

    return result;
  },
  registerParser: (pubkey: PublicKey | string, parser: AccountParser) => {
    if (pubkey) {
      const address = typeof pubkey === "string" ? pubkey : pubkey?.toBase58();
      accountParserMap.set(address, parser);
    }

    return pubkey;
  },
  queryMint: async (connection: Connection, pubKey: string | PublicKey) => {
    let id: PublicKey;
    if (typeof pubKey === "string") {
      id = new PublicKey(pubKey);
    } else {
      id = pubKey;
    }

    const address = id.toBase58();
    const mint = mintCache.get(address);
    if (mint) {
      return mint;
    }

    let query = pendingMintCalls.get(address);
    if (query) {
      return query;
    }

    query = getMintInfo(connection, id).then((data) => {
      pendingMintCalls.delete(address);

      mintCache.set(address, data);
      return data;
    }) as Promise<MintInfo>;
    pendingMintCalls.set(address, query as any); // eslint-disable-line

    return query;
  },
  getMint: (pubKey: string | PublicKey) => {
    let key: string;
    if (typeof pubKey !== "string") {
      key = pubKey.toBase58();
    } else {
      key = pubKey;
    }

    return mintCache.get(key);
  },
  addMint: (pubKey: PublicKey, obj: AccountInfo<Buffer>) => {
    const mint = decodeMint(obj.data);
    const id = pubKey.toBase58();
    mintCache.set(id, mint);
    return mint;
  },
};

const getWrapNativeAccount = (
  pubkey: string,
  account?: AccountInfo<Buffer>,
): TokenAccount | undefined => {
  if (!account) {
    return undefined;
  }

  const key = new PublicKey(pubkey);

  return {
    pubkey: pubkey,
    account,
    info: {
      address: key,
      mint: SOL_MINT,
      owner: key,
      amount: new u64(account.lamports),
      delegate: null,
      delegatedAmount: new u64(0),
      isInitialized: true,
      isFrozen: false,
      isNative: true,
      rentExemptReserve: null,
      closeAuthority: null,
    },
  };
};

export const getCachedAccount = (predicate: (account: TokenAccount) => boolean) => {
  for (const account of genericCache.values()) {
    if (predicate(account)) {
      return account as TokenAccount;
    }
  }
};

const useNativeAccount = () => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [nativeAccount, setNativeAccount] = useState<AccountInfo<Buffer>>();

  const updateCache = useCallback(
    (account) => {
      if (publicKey) {
        const wrapped = getWrapNativeAccount(publicKey.toBase58(), account);
        if (wrapped !== undefined) {
          const id = publicKey.toBase58();
          cache.registerParser(id, TokenAccountParser);
          genericCache.set(id, wrapped as TokenAccount);
          cache.emitter.raiseCacheUpdated(id, false, TokenAccountParser, true);
        }
      }
    },
    [publicKey],
  );

  useEffect(() => {
    let subId = 0;
    const updateAccount = (account: AccountInfo<Buffer> | null) => {
      if (account) {
        updateCache(account);
        setNativeAccount(account);
      }
    };

    (async () => {
      if (!connection || !publicKey) {
        return;
      }

      const account = await connection.getAccountInfo(publicKey);
      updateAccount(account);

      subId = connection.onAccountChange(publicKey, updateAccount);
    })();

    return () => {
      if (subId) {
        connection.removeAccountChangeListener(subId);
      }
    };
  }, [setNativeAccount, publicKey, connection, updateCache]);

  return { nativeAccount };
};

const CACHED_OWNERS = new Set<string>();
const cachedUserTokenAccounts = async (connection: Connection, owner?: PublicKey) => {
  if (!owner) {
    return;
  }

  // used for filtering account updates over websocket
  CACHED_OWNERS.add(owner.toBase58());

  // user accounts are updated via ws subscription
  const accounts = await connection.getTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  });

  accounts.value.forEach((info) => {
    cache.add(info.pubkey.toBase58(), info.account, TokenAccountParser);
  });
};

export const AccountsProvider: React.FC = ({ children }) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [userAccounts, setUserAccounts] = useState<TokenAccount[]>([]);
  const { nativeAccount } = useNativeAccount();
  const walletKey = publicKey?.toBase58();

  const selectUserAccounts = useCallback(() => {
    return cache
      .byParser(TokenAccountParser)
      .map((id) => cache.get(id))
      .filter((a) => a && a.info.owner.toBase58() === walletKey)
      .map((a) => a as TokenAccount);
  }, [walletKey]);

  useEffect(() => {
    const accounts = selectUserAccounts().filter((a) => a !== undefined) as TokenAccount[];
    setUserAccounts(accounts);
  }, [nativeAccount, tokenAccounts, selectUserAccounts]);

  useEffect(() => {
    const subs: number[] = [];
    cache.emitter.onCache((args) => {
      if (args.isNew && args.isActive) {
        const id = args.id;
        const deserialize = args.parser;
        connection.onAccountChange(new PublicKey(id), (info) => {
          cache.add(id, info, deserialize);
        });
      }
    });

    return () => {
      subs.forEach((id) => connection.removeAccountChangeListener(id));
    };
  }, [connection]);

  useEffect(() => {
    if (!connection || !publicKey) {
      setTokenAccounts([]);
    } else {
      cachedUserTokenAccounts(connection, publicKey).then(() => {
        setTokenAccounts(selectUserAccounts());
      });

      // This can return different types of accounts: token-account, mint, multisig
      // TODO: web3.js expose ability to filter.
      // this should use only filter syntax to only get accounts that are owned by user
      const tokenSubId = connection.onProgramAccountChange(
        TOKEN_PROGRAM_ID,
        (info) => {
          // TODO: fix type in web3.js
          const id = info.accountId as unknown as string;
          // TODO: do we need a better way to identify layout (maybe a enum identifing type?)
          if (info.accountInfo.data.length === AccountLayout.span) {
            const data = decodeAccount(info.accountInfo.data);

            if (CACHED_OWNERS.has(data.owner.toBase58())) {
              cache.add(id, info.accountInfo, TokenAccountParser);
              setTokenAccounts(selectUserAccounts());
            }
          }
        },
        "singleGossip",
      );

      return () => {
        connection.removeProgramAccountChangeListener(tokenSubId);
      };
    }
  }, [connection, publicKey, selectUserAccounts]);

  return (
    <AccountsContext.Provider
      value={{
        userAccounts,
        nativeAccount,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccountsContext = () => {
  const context = useContext(AccountsContext);
  return context;
};
