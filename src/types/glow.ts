import { EventEmitter } from "@solana/wallet-adapter-base";
import {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from "@solana/web3.js";

interface GlowWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(newPublicKey: PublicKey): unknown;
}

export interface GlowWallet extends EventEmitter<GlowWalletEvents> {
  isGlow?: boolean;
  publicKey?: { toBytes(): Uint8Array };
  address?: string;
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

export interface GlowWindow extends Window {
  glow?: GlowWallet;
}
