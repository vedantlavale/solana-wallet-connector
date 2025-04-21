import { useMemo, useEffect, useState } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useWallet,
  useConnection,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

import "@solana/wallet-adapter-react-ui/styles.css";
import { Container, Typography, Box } from "@mui/material";

function WalletInfo() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9); // Convert to SOL
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <Box mt={2}>
      <Typography variant="body1">
        <strong>Address:</strong> {publicKey.toBase58()}
      </Typography>
      <Typography variant="body1">
        <strong>Balance:</strong> {balance?.toFixed(3)} SOL
      </Typography>
    </Box>
  );
}

function Content() {
  return (
    <Container maxWidth="sm" style={{ paddingTop: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Solana Wallet Connect
      </Typography>
      <WalletMultiButton />
      <WalletInfo />
    </Container>
  );
}

function App() {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <Content />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
