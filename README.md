## Solana Active Wallet React

`useSolanaActiveWallet()`

This is a react hook that detects a user's current active solana wallet and returns the public key on the client. It detects when a user has changed their active wallet inside a browser wallet extension and will update and return the active public key accordingly.
The wallets currently supported are:

- Phantom
- Backpack
- Solflare
- TrustWallet
- Glow

Support for other wallets will be added in the future.

### Demo Website

[Demo](https://solana-active-wallet-react-demo.vercel.app/)

### Installation

```bash
npm install solana-active-wallet-react
```
### Note the useSolanaActiveWallet hook relies on the "publicKey" and "wallet" returned by the useWallet hook from the @solana/wallet-adapter-react package. These values are both passed in as parameters when using the hook.

### Basic Usage

```tsx
import useSolanaActiveWallet from "solana-active-wallet-react";
import { useWallet } from "@solana/wallet-adapter-react";

const { publicKey, wallet } = useWallet();
const { activeWalletAddress } = useSolanaActiveWallet(publicKey, wallet);

console.log("active wallet address", activeWalletAddress);
```

### Example Usage

```tsx
import useActiveWallet from "solana-active-wallet-react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

function ConnectButton() {
  const { publicKey, wallet, connected, disconnect } = useWallet();
  const { slicedWalletAddress } = useSolanaActiveWallet(publicKey, wallet);
  const { setVisible: setModalVisible } = useWalletModal();

  return (
    <button
      className="wallet-connect-button"
      onClick={() => !connected && setModalVisible(true)}
    >
      {connected ? slicedWalletAddress : "Connect Wallet"}
    </button>
  );
}
```

### Returned Values

- ```activePublicKey: PublicKey | undefined```  

The public key of the currently active wallet
- ```activeWalletAddress: string | undefined```

The wallet address of the currently active wallet
- ```slicedWalletAddress: string | null```

The wallet address of the currently active wallet sliced for a shortened format eg: 5KgT...gQdY
- ```phantomProvider: PhantomWallet | null```

