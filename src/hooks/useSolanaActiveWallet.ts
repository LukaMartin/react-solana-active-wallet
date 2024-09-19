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
}

interface PhantomWindow extends Window {
  phantom?: {
    solana?: PhantomWallet;
  };
  solana?: PhantomWallet;
}

interface BackpackWindow extends Window {
  backpack?: BackpackWallet;
}

export default function useSolanaActiveWallet(
  publicKey: PublicKey | null,
  wallet: Wallet | null
) {
  const [activePublicKey, setActivePublicKey] = useState<PublicKey | null>(
    publicKey
  );

  const getPhantomProvider = () => {
    if (window && "phantom" in window) {
      const provider = window.phantom as PhantomWindow;

      if (provider) {
        return provider.solana as unknown as PhantomWallet;
      }
    }
  };

  const getBackpackProvider = () => {
    if (window && "backpack" in window) {
      const provider = window.backpack as BackpackWindow;

      if (provider) {
        return provider as unknown as BackpackWallet;
      }
    }
  };

  const phantomProvider = getPhantomProvider();
  const backpackProvider = getBackpackProvider();

  useEffect(() => {
    phantomProvider?.on("accountChanged", async (publicKey: PublicKey) => {
      if (publicKey) {
        // Set new public key and continue as usual
        setActivePublicKey(publicKey);
      } else {
        try {
          // connect new wallet and set new public key
          const resp = await phantomProvider.connect();
          if (resp && resp.publicKey) {
            setActivePublicKey(resp.publicKey);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });

    // Clear users public key on disconnect
    phantomProvider?.on("disconnect", () => {
      setActivePublicKey(null);
    });
  }, [phantomProvider]);

  useEffect(() => {
    backpackProvider?.on("connect", () => {
      // Assign public key to a variable on connect
      const newPublicKey = backpackProvider.publicKey;
      // Set new public key
      setActivePublicKey(newPublicKey ? new PublicKey(newPublicKey) : null);
    });

    backpackProvider?.on("disconnect", () => {
      // Clear users public key on disconnect
      setActivePublicKey(null);
    });
  }, [backpackProvider]);

  useEffect(() => {
    // Add event listeners for Solflare wallet
    if (wallet?.adapter.name === "Solflare") {
      wallet?.adapter.on("connect", () => {
        setActivePublicKey(publicKey);
      });

      wallet?.adapter.on("disconnect", () => {
        setActivePublicKey(null);
      });
      // Set public key when user switches active wallet inside Solflare extension
      setActivePublicKey(publicKey);
    }
  }, [wallet, publicKey]);

  useEffect(() => {
    if (!activePublicKey) {
      setActivePublicKey(publicKey);
    }
  }, [publicKey, activePublicKey]);

  return { activePublicKey, phantomProvider, backpackProvider };
}
