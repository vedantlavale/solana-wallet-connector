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
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { styled } from "@mui/material/styles";

const subtleDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    primary: {
      main: '#60a5fa', // Muted blue
    },
    text: {
      primary: '#fff',
      secondary: '#cbd5e1',
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});

const SubtleCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 1.5,
  background: theme.palette.background.paper,
  boxShadow: '0 4px 24px 0 rgba(30,41,59,0.25)',
  border: `1.5px solid ${theme.palette.primary.main}22`,
  padding: theme.spacing(4, 3),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const SubtleWalletButton = styled(WalletMultiButton)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: theme.palette.primary.main, // Match surrounding blue
  color: '#fff',
  fontWeight: 600,
  fontSize: 16,
  boxShadow: '0 2px 8px 0 rgba(96,165,250,0.10)',
  '&:hover': {
    background: theme.palette.primary.dark, // Slightly darker blue on hover
  },
}));

function WalletInfo() {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        setBalance(null);
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9);
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <Box>
      <Divider sx={{ mb: 2, bgcolor: 'primary.dark', opacity: 0.2 }} />
      <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight={600}>
        Wallet Address
      </Typography>
      <Typography variant="body2" sx={{ wordBreak: 'break-all', color: 'text.primary', fontWeight: 500 }}>
        {publicKey.toBase58()}
      </Typography>
      <Divider sx={{ my: 2, bgcolor: 'primary.dark', opacity: 0.2 }} />
      <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
        Balance
      </Typography>
      <Typography variant="h5" color="primary" fontWeight={700}>
        {balance === null ? '--' : `${balance.toFixed(3)} SOL`}
      </Typography>
    </Box>
  );
}

function Content() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" elevation={0} sx={{
        background: 'rgba(30,41,59,0.95)',
        boxShadow: '0 2px 12px 0 rgba(96,165,250,0.10)',
        borderBottom: '1px solid #334155',
      }}>
        <Toolbar>
          <Avatar sx={{
            bgcolor: 'primary.main',
            mr: 2,
            width: 44,
            height: 44,
          }}>
            <AccountBalanceWalletIcon fontSize="medium" />
          </Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', letterSpacing: 1 }}>
            Solana Wallet
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box width="100%">
          <SubtleCard>
            <Avatar sx={{
              bgcolor: 'primary.main',
              width: 60,
              height: 60,
              mb: 2,
            }}>
              <AccountBalanceWalletIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#fff', mb: 1 }}>
              Solana Wallet Connect
            </Typography>
            <SubtleWalletButton fullWidth />
            <WalletInfo />
          </SubtleCard>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ThemeProvider theme={subtleDarkTheme}>
      <CssBaseline />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Content />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;
