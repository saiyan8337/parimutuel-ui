import { useEffect, useMemo, useState } from "react";
import { CryptoEnum, MarketPairEnum } from "@hxronetwork/parimutuelsdk";

import { getWeb3Config } from "@constants/config";
import { useParimutuel } from "@contexts/parimutuel";
import { usePyth } from "@contexts/pyth";
import { useAccounts } from "@hooks/useAccounts";
import { useMint } from "@hooks/useMint";
import { fromLamports } from "@utils/mint";
import { getCryptoAbbr, getCryptoAddress } from "@utils/utils";

type Balance = {
  cryptoAmount: number;
  usdAmount: number;
};

export const useBalance = () => {
  const { priceMap } = usePyth();
  const { traderFeePayerAccount } = useParimutuel();
  const { accountByMint } = useAccounts();

  const [solBalance, setSolBalance] = useState<Balance>({ cryptoAmount: 0, usdAmount: 0 });
  const [usdcBalance, setUsdcBalance] = useState<Balance>({ cryptoAmount: 0, usdAmount: 0 });
  const [hxroBalance, setHxroBalance] = useState<Balance>({ cryptoAmount: 0, usdAmount: 0 });
  const [traderAccountHxroBalance, setTraderAccountHxroBalance] = useState<Balance>({
    cryptoAmount: 0,
    usdAmount: 0,
  });

  const { USDC_MINT, HXRO_MINT } = getWeb3Config();

  const solPrice = useMemo(() => {
    const price = priceMap[MarketPairEnum.SOLUSD];
    return price?.priceData.price ?? 0;
  }, [priceMap]);

  const hxroPrice = useMemo(() => {
    const price = priceMap[MarketPairEnum.HXROUSD];
    return price?.priceData.price ?? 0;
  }, [priceMap]);

  const solAbbr = getCryptoAbbr(CryptoEnum.SOLANA);

  // TODO: different env get from different source
  const solAddress = getCryptoAddress(solAbbr);
  const usdcAddress = USDC_MINT.toString();
  const hxroAddress = HXRO_MINT.toString();

  const solMint = useMint(solAddress);
  const hxroMint = useMint(hxroAddress);
  const usdcMint = useMint(usdcAddress);

  const solAccount = useMemo(() => accountByMint.get(solAddress), [accountByMint, solAddress]);
  const hxroAccount = useMemo(() => accountByMint.get(hxroAddress), [accountByMint, hxroAddress]);
  const usdcAccount = useMemo(() => accountByMint.get(usdcAddress), [accountByMint, usdcAddress]);

  useEffect(() => {
    // sol balance
    if (solAccount) {
      const cryptoAmount = fromLamports(solAccount, solMint);
      const usdAmount = solPrice ? cryptoAmount * solPrice : 0;
      setSolBalance({ cryptoAmount, usdAmount });
    }

    // usdc balance
    if (usdcAccount) {
      const cryptoAmount = fromLamports(usdcAccount, usdcMint);
      setUsdcBalance({ cryptoAmount, usdAmount: cryptoAmount });
    }

    // hxro balance
    if (hxroAccount) {
      const cryptoAmount = fromLamports(hxroAccount, hxroMint);
      const usdAmount = hxroPrice ? cryptoAmount * hxroPrice : 0;
      setHxroBalance({ cryptoAmount, usdAmount });
    }

    if (traderFeePayerAccount) {
      const cryptoAmount = fromLamports(traderFeePayerAccount.info.tokenAccount, hxroMint);
      const usdAmount = hxroPrice ? cryptoAmount * hxroPrice : 0;
      setTraderAccountHxroBalance({ cryptoAmount, usdAmount });
    }
  }, [
    traderFeePayerAccount,
    solPrice,
    hxroPrice,
    solAccount,
    hxroAccount,
    usdcAccount,
    hxroMint,
    solMint,
    usdcMint,
  ]);

  return {
    solPrice,
    hxroPrice,
    solBalance,
    usdcBalance,
    hxroBalance,
    traderAccountHxroBalance,
  };
};
