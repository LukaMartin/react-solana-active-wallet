import { useEffect } from "react";
import { getBackpackProvider } from "../providers/getBackpackProvider";
import { PublicKey } from "@solana/web3.js";

export default function useBackpackListener(
  updateActivePublicKey: (publicKey: PublicKey | null) => void
) {
  const backpackProvider = getBackpackProvider();

  useEffect(() => {
    if (!backpackProvider) return;
    
    backpackProvider.on("connect", () => {
      // Assign public key to a variable on connect
      const newPublicKey = backpackProvider.publicKey;
      // Set new public key
      updateActivePublicKey(newPublicKey ? new PublicKey(newPublicKey) : null);
    });

    backpackProvider.on("disconnect", () => {
      // Clear users public key on disconnect
      updateActivePublicKey(null);
    });

    return () => {
      // Remove event listeners when the component unmounts
      backpackProvider.off("connect", () => {});
      backpackProvider.off("disconnect", () => {});
    };
  }, [backpackProvider]);
}
