## Solana Active Wallet

This is a simple hook that detects a user's current active solana wallet on the client. It detects when a user has changed their active wallet inside a browser wallet extension.
This currently supports Phantom and Backpack wallets. Support for other wallets will be added in the future.

### Installation

```bash
npm install react-solana-active-wallet
```

### Usage

```tsx
import useSolanaActiveWallet from "solana-active-wallet-react";

const { activePublicKey, phantomProvider, backpackProvider } = useSolanaActiveWallet();
```