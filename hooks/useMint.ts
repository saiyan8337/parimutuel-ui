import { useEffect, useState } from "react";
import { MintInfo } from "@solana/spl-token";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

import { cache } from "@contexts/accounts";
import { MintParser } from "@utils/parser";

export const useMint = (key?: string | PublicKey) => {
  const { connection } = useConnection();
  const [mint, setMint] = useState<MintInfo>();

  const id = typeof key === "string" ? key : key?.toBase58();

  useEffect(() => {
    if (!id) {
      return;
    }

    cache
      .query(connection, id, MintParser)
      .then((acc) => setMint(acc.info as any)) // eslint-disable-line
      .catch((err) => {
        throw new Error(err);
      });

    const dispose = cache.emitter.onCache((e) => {
      const event = e;
      if (event.id === id) {
        cache.query(connection, id, MintParser).then((mint) => setMint(mint.info as any)); // eslint-disable-line
      }
    });
    return () => {
      dispose();
    };
  }, [connection, id]);

  return mint;
};
