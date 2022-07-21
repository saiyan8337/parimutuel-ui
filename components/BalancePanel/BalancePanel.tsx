import React from "react";
import { CryptoEnum } from "@hxronetwork/parimutuelsdk";
import { Flex } from "@chakra-ui/react";

import Balance from "@components/Balance/Balance";
import PanelName from "@components/PanelName/PanelName";
import { useBalance } from "@hooks/useBalance";

const BalancePanel: React.FC = () => {
  const { solBalance, usdcBalance, hxroBalance } = useBalance();

  return (
    <Flex flexDirection="column" width="251px">
      <PanelName name="My Balances" />
      <Balance
        crypto={CryptoEnum.SOLANA}
        fiatAmount={solBalance.usdAmount.toFixed(2)}
        cryptoAmount={solBalance.cryptoAmount.toFixed(8)}
      />
      <Balance
        crypto={CryptoEnum.USDC}
        fiatAmount={usdcBalance.usdAmount.toFixed(2)}
        cryptoAmount={usdcBalance.cryptoAmount.toFixed(8)}
        mt="4px"
      />
      <Balance
        crypto={CryptoEnum.HXRO}
        fiatAmount={hxroBalance.usdAmount.toFixed(2)}
        cryptoAmount={hxroBalance.cryptoAmount.toFixed(8)}
        mt="4px"
      />
    </Flex>
  );
};

export default BalancePanel;
