import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  code: number;
  message: string;
};

const handler = (req: NextApiRequest, res: NextApiResponse<Data>) => {
  res.status(200).json({ code: 200, message: "frontend is alive" });
};

export default handler;
