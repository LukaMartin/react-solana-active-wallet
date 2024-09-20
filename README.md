## Solana Active Wallet React

This is a react hook that detects a user's current active solana wallet and returns the public key on the client. It detects when a user has changed their active wallet inside a browser wallet extension and will update and return the active public key accordingly.
The wallets currently supported are:
- Phantom
- Backpack
- Solflare
- TrustWallet

Support for other wallets will be added in the future.

### Note the hook relies on the "publicKey" and "wallet" returned by the useWallet hook from @solana/wallet-adapter-react.

### Demo Website

[Demo](https://solana-active-wallet-react-demo.vercel.app/)

### Installation

```bash
npm install solana-active-wallet-react
```

### Usage

```tsx
import useSolanaActiveWallet from "solana-active-wallet-react";
import { useWallet } from "@solana/wallet-adapter-react";

const { publicKey, wallet } = useWallet();
const { activePublicKey } = useSolanaActiveWallet(publicKey, wallet);

The values returned by the hook are:
- activePublicKey: PublicKey | undefined - The public key of the currently active wallet
- activeWalletAddress: string | undefined - The wallet address of the currently active wallet
- slicedWalletAddress: string | null - The wallet address of the currently active wallet sliced for a shortened format  eg: 5KgT...gQdY
- phantomProvider: PhantomWallet | null - The Phantom provider from the window.phantom object
- backpackProvider: BackpackWallet | null - The Backpack provider from the window.backpack object
- trustProvider: TrustWallet | null - The Trust provider from the window.trustwallet object
```