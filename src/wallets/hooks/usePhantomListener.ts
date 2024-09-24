import { useEffect } from "react";
import { getPhantomProvider } from "../providers/getPhantomProvider";
import { PublicKey } from "@solana/web3.js";

export default function usePhantomListener(
  updateActivePublicKey: (publicKey: PublicKey | null) => void
) {
  const phantomProvider = getPhantomProvider();

  useEffect(() => {
    if (!phantomProvider) return;

    const handleAccountChanged = async (publicKey: PublicKey) => {
      if (publicKey) {
        // Set new public key and continue as usual
        updateActivePublicKey(publicKey);
      } else {
        try {
          // connect new wallet and set new public key
          const resp = await phantomProvider.connect();
          if (resp && resp.publicKey) {
            updateActivePublicKey(resp.publicKey);
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    // Function to clear the public key when the wallet is disconnected
    const handleDisconnect = () => {
      updateActivePublicKey(null);
    };

    // Add event listeners for Phantom wallet
    phantomProvider.on("accountChanged", handleAccountChanged);
    phantomProvider.on("disconnect", handleDisconnect);

    return () => {
      // Remove event listeners when the component unmounts
      phantomProvider.off("accountChanged", handleAccountChanged);
      phantomProvider.off("disconnect", handleDisconnect);
    };
  }, [phantomProvider]);
}
