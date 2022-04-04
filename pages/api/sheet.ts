import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import { GoogleSpreadsheet } from "google-spreadsheet";

interface SheetNextApiRequest extends NextApiRequest {
  query: {
    list: "black" | "white";
  };
}

type Response = {
  code: number;
  wallets: string[];
};

const handler = async (req: SheetNextApiRequest, res: NextApiResponse<Response>) => {
  const { list } = req.query;
  const {
    serverRuntimeConfig: {
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      GOOGLE_PRIVATE_KEY,
      GOOGLE_BLACKLIST_SHEET_ID,
      GOOGLE_WHITELIST_SHEET_ID,
    },
  } = getConfig();

  const sheetId = list === "black" ? GOOGLE_BLACKLIST_SHEET_ID : GOOGLE_WHITELIST_SHEET_ID;
  const doc = new GoogleSpreadsheet(sheetId);
  const privateKey = Buffer.from(GOOGLE_PRIVATE_KEY, "base64").toString();

  await doc.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: privateKey.replace(/\\n/gm, "\n"),
  });

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const wallets = rows.map((row) => row.wallet);

  res.status(200).json({ code: 200, wallets });
};

export default handler;
