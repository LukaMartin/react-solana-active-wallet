import { Connection, PublicKey } from "@solana/web3.js";

export interface BackpackWallet {
  connection: Connection;
  isBackpack: boolean;
  isConnected: boolean;
  isXnft: boolean | undefined;
  publicKey: PublicKey;
  on: (event: string, callback: () => void) => void;
  off: (event: string, callback: () => void) => void;
}
