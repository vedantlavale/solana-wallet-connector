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
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Container,
  useTheme,
  Paper,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { styled } from "@mui/material/styles";

const StyledWalletButton = styled(WalletMultiButton)(({ theme }) => ({
  marginTop: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(1, 3),
  fontWeight: 500,
  fontSize: 16,
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    background: theme.palette.primary.dark,
  },
}));

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
    <Card elevation={4} sx={{ mt: 4, borderRadius: 3, p: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <AccountBalanceWalletIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Wallet Address
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all', fontWeight: 500 }}>
              {publicKey.toBase58()}
            </Typography>
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Balance
              </Typography>
              <Typography variant="h6" color="primary" fontWeight={700}>
                {balance?.toFixed(3) ?? '--'} SOL
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Content() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
            <AccountBalanceWalletIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={700}>
            Solana Wallet
          </Typography>
        </Toolbar>
      </AppBar>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ flex: 1, minHeight: '80vh' }}
      >
        <Grid item xs={11} sm={8} md={6} lg={4}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, background: 'transparent', boxShadow: 'none' }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mt: 2 }}>
                Solana Wallet Connect
              </Typography>
              <StyledWalletButton />
              <WalletInfo />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
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
