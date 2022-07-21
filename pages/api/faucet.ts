import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { ParimutuelWeb3 } from "parimutuelsdk";
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

import { getWeb3Config } from "@constants/config";

interface FaucetNextApiRequest extends NextApiRequest {
  body: {
    wallet: string;
    token: string;
    amount?: number;
  };
}

type Response = {
  code: number;
  message: string;
};

const handler = async (req: FaucetNextApiRequest, res: NextApiResponse<Response>) => {
  const { wallet, token, amount } = req.body;
  const {
    serverRuntimeConfig: { AUTHORITY_KEY_PAIR },
    publicRuntimeConfig: { APP_ENV },
  } = getConfig();

  // disable other than dev env
  if (APP_ENV !== "dev") return;

  const connection = new Connection(
    "https://api.devnet.rpcpool.com/081597d8bb90b3da7fd354257950",
    "confirmed",
  );
  const web3 = new ParimutuelWeb3(getWeb3Config(), connection);
  const base64ToString = Buffer.from(AUTHORITY_KEY_PAIR, "base64").toString();
  const keypairJson = JSON.parse(base64ToString);

  const authorityKeypair = Keypair.fromSecretKey(new Uint8Array(keypairJson));
  const balance = await connection.getBalance(authorityKeypair.publicKey);

  if (balance < 10000000) {
    const airdropSignature = await connection.requestAirdrop(
      authorityKeypair.publicKey,
      LAMPORTS_PER_SOL,
    );
    console.log("Airdropping to payer (mint authority)...");
    await connection.confirmTransaction(airdropSignature);
    console.log("Airdrop finished.");
  }

  try {
    await web3.transferToken(
      new PublicKey(wallet),
      new PublicKey(token),
      authorityKeypair,
      amount ?? 100000000000000,
    );
  } catch (err) {
    console.log(err);
  }

  res.status(200).json({ code: 200, message: "transaction success" });
};

export default handler;
