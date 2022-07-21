import React from "react";
import { CryptoEnum } from "parimutuelsdk";
import { Flex } from "@chakra-ui/react";

import FeeAccount from "@components/FeeAccount/FeeAccount";
import PanelName from "@components/PanelName/PanelName";
import { useBalance } from "@hooks/useBalance";

const FeeAccountPanel: React.FC = () => {
  const { traderAccountHxroBalance } = useBalance();

  return (
    <Flex flexDirection="column" width="251px" marginTop="24px">
      <PanelName
        name="HXRO Fee Account"
        hasTooltip
        tips="When you hold HXRO and use HXRO to pay for platform fees, you will receive a discount on fee"
      />
      <FeeAccount
        crypto={CryptoEnum.HXRO}
        cryptoAmount={traderAccountHxroBalance.cryptoAmount.toFixed(8)}
        mt="4px"
      />
    </Flex>
  );
};

export default FeeAccountPanel;
