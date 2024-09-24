import { GlowWallet } from "../../types/glow";

export const getGlowProvider = () => {
  if (window && "glow" in window) {
    const provider = window.glow as GlowWallet;

    if (provider && provider.isGlow) {
      return provider;
    }
  }

  return null;
};
    