import { useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import { Wallet } from "../../types/wallet";

export default function useSolflareListener(
  updateActivePublicKey: (publicKey: PublicKey | null) => void,
  wallet: Wallet | null,
) {

  useEffect(() => {
    if (wallet?.adapter.name === "Solflare") {
      // Function to set the public key when the wallet is connected
      const handleConnect = () => updateActivePublicKey(wallet.adapter.publicKey);
      // Function to clear the public key when the wallet is disconnected
      const handleDisconnect = () => updateActivePublicKey(null);
      // Add event listeners for Solflare wallet
      wallet.adapter.on("connect", handleConnect);
      wallet.adapter.on("disconnect", handleDisconnect);
      updateActivePublicKey(wallet.adapter.publicKey);

      return () => {
        // Remove event listeners when the component unmounts
        wallet.adapter.off("connect", handleConnect);
        wallet.adapter.off("disconnect", handleDisconnect);
      };
    }
  }, [wallet]);
}
