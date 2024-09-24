import { useEffect } from "react";
import { getGlowProvider } from "../providers/getGlowProvider";
import { PublicKey } from "@solana/web3.js";
import { Wallet } from "../../types/wallet";

export default function useGlowListener(
  updateActivePublicKey: (publicKey: PublicKey | null) => void,
  wallet: Wallet | null
) {
  const glowProvider = getGlowProvider();

  useEffect(() => {
    if (!glowProvider) return;

    const handleAccountChanged = async (publicKey: PublicKey) => {
      if (publicKey) {
        // Set new public key and continue as usual
        updateActivePublicKey(publicKey);
      } else {
        try {
          // connect new wallet and set new public key
          const resp = await glowProvider.connect();
          if (resp && resp.publicKey) {
            updateActivePublicKey(resp.publicKey);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    // Add event listeners for Glow wallet
    glowProvider.on("accountChanged", handleAccountChanged);

    if (wallet?.adapter.name === "Glow") {
      // Function to set the public key when the wallet is connected
      const handleConnect = () =>
        updateActivePublicKey(wallet.adapter.publicKey);
      // Function to clear the public key when the wallet is disconnected
      const handleDisconnect = () => updateActivePublicKey(null);
      // Add event listeners for Glow wallet
      wallet.adapter.on("connect", handleConnect);
      wallet.adapter.on("disconnect", handleDisconnect);

      return () => {
        // Remove event listeners when the component unmounts
        wallet.adapter.off("connect", handleConnect);
        wallet.adapter.off("disconnect", handleDisconnect);
      };
    }

    return () => {
      // Remove event listeners when the component unmounts
      glowProvider.off("accountChanged", handleAccountChanged);
    };
  }, [wallet]);
}
