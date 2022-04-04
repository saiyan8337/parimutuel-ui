import { useWallet } from "@solana/wallet-adapter-react";

import { useGeo } from "@contexts/geo";
import { useModal } from "@contexts/modal";
import { useWhitelist } from "@contexts/whitelist";

export type BlockProps = { isBlocked: boolean; setModal?: (open: boolean) => void };

export const useBlock = (): BlockProps => {
  const { connected, publicKey } = useWallet();
  const { whitelist, blacklist } = useWhitelist();
  const { isGeoBlocked } = useGeo();
  const { setIsWalletShown, setIsWhitelistShown, setIsBlacklistShown, setIsGeoBlockShown } =
    useModal();

  if (!publicKey || !connected) {
    return { isBlocked: true, setModal: setIsWalletShown };
  }

  if (isGeoBlocked) {
    return { isBlocked: true, setModal: setIsGeoBlockShown };
  }

  if (!whitelist.includes(publicKey.toBase58())) {
    return { isBlocked: true, setModal: setIsWhitelistShown };
  }

  if (blacklist.includes(publicKey.toBase58())) {
    return { isBlocked: true, setModal: setIsBlacklistShown };
  }

  return { isBlocked: false };
};
