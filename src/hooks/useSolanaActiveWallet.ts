import { useEffect, useState } from "react";
import type {
  EventEmitter,
  Adapter,
  WalletReadyState,
} from "@solana/wallet-adapter-base";
import type {
  Connection,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";

interface Wallet {
  adapter: Adapter;
  readyState: WalletReadyState;
}

interface PhantomWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(newPublicKey: PublicKey): unknown;
}

interface PhantomWallet extends EventEmitter<PhantomWalletEvents> {
  isPhantom?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isConnected: boolean;
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>;
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>;
  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  connect(): Promise<{ publicKey: PublicKey } | void>;
  disconnect(): Promise<void>;
}

interface BackpackWallet {
  connection: Connection;
  isBackpack: boolean;
  isConnected: boolean;
  isXnft: boolean | undefined;
  publicKey: PublicKey;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}

interface TrustWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(publicKey: PublicKey): unknown;
}

interface TrustWallet extends EventEmitter<TrustWalletEvents> {
  isTrust?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  isTrustWallet: boolean;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
  signAndSendTransaction(
    transaction: Transaction,
    options?: SendOptions
  ): Promise<{ signature: TransactionSignature }>;
  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

interface PhantomWindow extends Window {
  phantom?: {
    solana?: PhantomWallet;
  };
  solana?: PhantomWallet;
}

interface TrustWindow extends Window {
  trustwallet?: {
    solana?: TrustWallet;
  };
}

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

  const getPhantomProvider = () => {
    if (window && "phantom" in window) {
      const provider = window.phantom as PhantomWindow;

      if (provider && provider.solana && provider.solana.isPhantom) {
        return provider.solana as unknown as PhantomWallet;
      }
    }
  };

  const getBackpackProvider = () => {
    if (window && "backpack" in window) {
      const provider = window.backpack as BackpackWallet;

      if (provider && provider.isBackpack) {
        return provider;
      }
    }
  };

  const getTrustProvider = () => {
    if (window && "trustwallet" in window) {
      const provider = (window as TrustWindow).trustwallet;

      if (provider?.solana?.isTrustWallet) {
        return provider.solana;
      }
    }
  };

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
