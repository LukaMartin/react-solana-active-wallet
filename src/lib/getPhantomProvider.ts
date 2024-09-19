import { PhantomWallet, PhantomWindow } from "../types/phantom";

export const getPhantomProvider = () => {
  if (window && "phantom" in window) {
    const provider = window.phantom as PhantomWindow;

    if (provider && provider.solana && provider.solana.isPhantom) {
      return provider.solana as unknown as PhantomWallet;
    }
  }
};
