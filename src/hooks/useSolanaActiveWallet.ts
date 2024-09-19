import { useEffect, useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { getPhantomProvider } from "../lib/getPhantomProvider";
import { getBackpackProvider } from "../lib/getBackpackProvider";
import { getTrustProvider } from "../lib/getTrustProvider";
import { Wallet } from "../types/wallet";

export default function useSolActiveWallet(
  publicKey: PublicKey | null,
  wallet: Wallet | null
) {
  const [activePublicKey, setActivePublicKey] = useState<PublicKey | null>(
    () => {
      const storedPublicKey = localStorage.getItem("activePubKey");
      return storedPublicKey ? new PublicKey(storedPublicKey) : null;
    }
  );

  const phantomProvider = getPhantomProvider();
  const backpackProvider = getBackpackProvider();
  const trustProvider = getTrustProvider();

  const updateActivePublicKey = (newPublicKey: PublicKey | null) => {
    setActivePublicKey(newPublicKey);
    if (newPublicKey) {
      localStorage.setItem("activePubKey", newPublicKey.toBase58());
    } else {
      localStorage.removeItem("activePubKey");
    }
  };

  useEffect(() => {
    const handleAccountChanged = async (publicKey: PublicKey) => {
      if (publicKey) {
        // Set new public key and continue as usual
        updateActivePublicKey(publicKey);
      } else {
        try {
          // connect new wallet and set new public key
          if (phantomProvider) {
            const resp = await phantomProvider.connect();
            if (resp && resp.publicKey) {
              updateActivePublicKey(resp.publicKey);
            }
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
    phantomProvider?.on("accountChanged", handleAccountChanged);
    phantomProvider?.on("disconnect", handleDisconnect);

    return () => {
      // Remove event listeners when the component unmounts
      phantomProvider?.off("accountChanged", handleAccountChanged);
      phantomProvider?.off("disconnect", handleDisconnect);
    };
  }, [phantomProvider]);

  useEffect(() => {
    backpackProvider?.on("connect", () => {
      // Assign public key to a variable on connect
      const newPublicKey = backpackProvider.publicKey;
      // Set new public key
      updateActivePublicKey(newPublicKey ? new PublicKey(newPublicKey) : null);
    });

    backpackProvider?.on("disconnect", () => {
      // Clear users public key on disconnect
      updateActivePublicKey(null);
    });

    return () => {
      // Remove event listeners when the component unmounts
      backpackProvider?.off("connect", () => {});
      backpackProvider?.off("disconnect", () => {});
    };
  }, [backpackProvider]);

  useEffect(() => {
    if (wallet?.adapter.name === "Solflare") {
      // Function to set the public key when the wallet is connected
      const handleConnect = () => updateActivePublicKey(publicKey);
      // Function to clear the public key when the wallet is disconnected
      const handleDisconnect = () => updateActivePublicKey(null);
      // Add event listeners for Solflare wallet
      wallet.adapter.on("connect", handleConnect);
      wallet.adapter.on("disconnect", handleDisconnect);
      updateActivePublicKey(publicKey);

      return () => {
        // Remove event listeners when the component unmounts
        wallet.adapter.off("connect", handleConnect);
        wallet.adapter.off("disconnect", handleDisconnect);
      };
    }
  }, [wallet, publicKey]);

  useEffect(() => {
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
    trustProvider?.on("accountChanged", handleAccountChanged);
    trustProvider?.on("disconnect", handleDisconnect);

    return () => {
      // Remove event listeners when the component unmounts
      trustProvider?.off("accountChanged", handleAccountChanged);
      trustProvider?.off("disconnect", handleDisconnect);
    };
  }, [trustProvider, publicKey]);

  useEffect(() => {
    if (!activePublicKey) {
      updateActivePublicKey(publicKey);
    }
  }, [publicKey, activePublicKey]);

  return { activePublicKey, phantomProvider, backpackProvider, trustProvider };
}
