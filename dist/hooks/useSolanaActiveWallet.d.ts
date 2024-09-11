import type { EventEmitter } from "@solana/wallet-adapter-base";
import type { Connection, SendOptions, Transaction, TransactionSignature, VersionedTransaction } from "@solana/web3.js";
import { PublicKey } from "@solana/web3.js";
interface PhantomWalletEvents {
    connect(...args: unknown[]): unknown;
    disconnect(...args: unknown[]): unknown;
    accountChanged(newPublicKey: PublicKey): unknown;
}
interface PhantomWallet extends EventEmitter<PhantomWalletEvents> {
    isPhantom?: boolean;
    publicKey?: {
        toBytes(): Uint8Array;
    };
    isConnected: boolean;
    signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T>;
    signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]>;
    signAndSendTransaction<T extends Transaction | VersionedTransaction>(transaction: T, options?: SendOptions): Promise<{
        signature: TransactionSignature;
    }>;
    signMessage(message: Uint8Array): Promise<{
        signature: Uint8Array;
    }>;
    connect(): Promise<{
        publicKey: PublicKey;
    } | void>;
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
export default function useSolanaActiveWallet(publicKey: PublicKey | null): {
    activePublicKey: PublicKey | null;
    phantomProvider: PhantomWallet | undefined;
    backpackProvider: BackpackWallet | undefined;
};
export {};
