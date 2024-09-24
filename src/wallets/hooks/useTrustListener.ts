import { useEffect } from "react";
import { getTrustProvider } from "../providers/getTrustProvider";
import { PublicKey } from "@solana/web3.js";

export default function useTrustListener(
  updateActivePublicKey: (publicKey: PublicKey | null) => void
) {
  const trustProvider = getTrustProvider();

  useEffect(() => {
    if (!trustProvider) return;

    // Function for account change event in Trust wallet
    const handleAccountChanged = (publicKey: PublicKey) => {
      if (publicKey) {
        updateActivePublicKey(publicKey);
      }
    };
    // Function to clear the public key when the wallet is disconnected
    const handleDisconnect = () => {
      setTimeout(() => {
        updateActivePublicKey(null);
      }, 500);
    };
    // Add event listeners for Trust wallet
    trustProvider.on("accountChanged", handleAccountChanged);
    trustProvider.on("disconnect", handleDisconnect);

    return () => {
      // Remove event listeners when the component unmounts
      trustProvider.off("accountChanged", handleAccountChanged);
      trustProvider.off("disconnect", handleDisconnect);
    };
  }, [trustProvider]);
}
