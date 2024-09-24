import { BackpackWallet } from "../../types/backpack";

export const getBackpackProvider = () => {
  if (window && "backpack" in window) {
    const provider = window.backpack as BackpackWallet;

    if (provider && provider.isBackpack) {
      return provider;
    }
  }

  return null;
};
