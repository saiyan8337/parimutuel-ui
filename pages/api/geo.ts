import type { NextApiRequest, NextApiResponse } from "next";
import getConfig from "next/config";
import requestIp from "request-ip";

type Response = {
  code: number;
  geo: { countryCode: string; countryName: string };
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Response>) => {
  const {
    serverRuntimeConfig: { IP_STACK_API_KEY, GEO_BLOCKING },
  } = getConfig();

  if (!GEO_BLOCKING) {
    res.status(200).json({
      code: 200,
      geo: { countryCode: "None", countryName: "None" },
    });
    return;
  }

  const detectedIp = requestIp.getClientIp(req);
  const response = await fetch(
    `http://api.ipstack.com/${detectedIp}?access_key=${IP_STACK_API_KEY}`,
  );
  const result = await response.json();

  res.status(200).json({
    code: 200,
    geo: { countryCode: result.country_code, countryName: result.country_name },
  });
};

export default handler;
