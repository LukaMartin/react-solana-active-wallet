import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { Wallet } from "../types/wallet";
import { sliceWalletAddress } from "../lib/sliceWalletAddress";
import useBackpackListener from "../wallets/hooks/useBackpackListener";
import usePhantomListener from "../wallets/hooks/usePhantomListener";
import useSolflareListener from "../wallets/hooks/useSolflareListener";
import useTrustListener from "../wallets/hooks/useTrustListener";
import useGlowListener from "../wallets/hooks/useGlowListener";

export default function useSolanaActiveWallet(
  publicKey: PublicKey | null,
  wallet: Wallet | null
) {
  const [activePublicKey, setActivePublicKey] = useState<PublicKey | null>(
    () => {
      const storedPublicKey = localStorage.getItem("activePubKey");
      return storedPublicKey ? new PublicKey(storedPublicKey) : null;
    }
  );
  const activeWalletAddress = activePublicKey?.toBase58();
  const slicedWalletAddress = sliceWalletAddress(activeWalletAddress);
  
  const updateActivePublicKey = (newPublicKey: PublicKey | null) => {
    setActivePublicKey(newPublicKey);
    if (newPublicKey) {
      localStorage.setItem("activePubKey", newPublicKey.toBase58());
    } else {
      localStorage.removeItem("activePubKey");
    }
  };

  useBackpackListener(updateActivePublicKey);
  usePhantomListener(updateActivePublicKey);
  useSolflareListener(updateActivePublicKey, wallet);
  useTrustListener(updateActivePublicKey);
  useGlowListener(updateActivePublicKey, wallet);

  useEffect(() => {
    if (!activePublicKey) {
      updateActivePublicKey(publicKey);
    }
  }, [publicKey, activePublicKey]);

  return {
    activePublicKey,
    activeWalletAddress,
    slicedWalletAddress,
  };
}
