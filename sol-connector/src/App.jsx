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

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    primary: {
      main: '#38bdf8',
    },
    text: {
      primary: '#fff',
      secondary: '#cbd5e1',
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});

const StyledWalletButton = styled(WalletMultiButton)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  background: '#334155',
  color: '#fff',
  fontWeight: 600,
  fontSize: 16,
  boxShadow: theme.shadows[2],
  '&:hover': {
    background: '#475569',
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
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" elevation={0} sx={{
        background: 'rgba(30,41,59,0.7)',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 2px 16px 0 rgba(0,0,0,0.12)',
      }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, boxShadow: 2 }}>
            <AccountBalanceWalletIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', letterSpacing: 1 }}>
            Solana Wallet
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box width="100%">
          <Card elevation={8} sx={{
            bgcolor: 'background.paper',
            borderRadius: 4,
            p: { xs: 3, sm: 5 },
            boxShadow: '0 4px 32px 0 rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: { xs: '90vw', sm: 400 },
            maxWidth: 480,
          }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 2, boxShadow: 2 }}>
              <AccountBalanceWalletIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ color: '#fff', mb: 1 }}>
              Solana Wallet Connect
            </Typography>
            <StyledWalletButton fullWidth />
            <WalletInfo />
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ThemeProvider theme={darkTheme}>
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
