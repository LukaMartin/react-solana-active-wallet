import { EventEmitter } from "@solana/wallet-adapter-base";
import {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";

export interface TrustWalletEvents {
  connect(...args: unknown[]): unknown;
  disconnect(...args: unknown[]): unknown;
  accountChanged(publicKey: PublicKey): unknown;
}

export interface TrustWallet extends EventEmitter<TrustWalletEvents> {
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

export interface TrustWindow extends Window {
  trustwallet?: {
    solana?: TrustWallet;
  };
}
