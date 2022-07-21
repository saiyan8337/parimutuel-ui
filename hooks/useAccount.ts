import { useEffect, useState } from "react";
import { TokenAccount } from "@hxronetwork/parimutuelsdk";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { cache } from "@contexts/accounts";
import { TokenAccountParser } from "@utils/parser";

export const useAccount = (pubKey?: PublicKey) => {
  const { connection } = useConnection();
  const [account, setAccount] = useState<TokenAccount>();
  const key = pubKey?.toBase58();

  useEffect(() => {
    const query = async () => {
      try {
        if (!key) {
          return;
        }

        const acc = await cache.query(connection, key, TokenAccountParser).catch((err) => {
          throw new Error(err);
        });
        if (acc) {
          setAccount(acc);
        }
      } catch (err) {
        console.error(err);
      }
    };

    query();

    const dispose = cache.emitter.onCache((e) => {
      const event = e;
      if (event.id === key) {
        query();
      }
    });
    return () => {
      dispose();
    };
  }, [connection, key]);

  return account;
};
