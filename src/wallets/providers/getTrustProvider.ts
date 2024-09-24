import { TrustWindow } from "../../types/trust";

export const getTrustProvider = () => {
  if (window && "trustwallet" in window) {
    const provider = (window as TrustWindow).trustwallet;

    if (provider?.solana?.isTrustWallet) {
      return provider.solana;
    }
  }

  return null;
};
