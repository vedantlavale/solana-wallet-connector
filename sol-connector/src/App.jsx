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

function WalletInfo({ loading }) {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (publicKey) {
        setBalance(null); // reset before loading
        const lamports = await connection.getBalance(publicKey);
        setBalance(lamports / 1e9); // Convert to SOL
      }
    };
    fetchBalance();
  }, [publicKey, connection]);

  if (!publicKey) return null;

  return (
    <Card elevation={6} sx={{ mt: 4, borderRadius: 4, p: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
              <AccountBalanceWalletIcon fontSize="large" />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="body1" color="text.secondary" gutterBottom fontWeight={600}>
              Wallet Address
            </Typography>
            <Typography variant="body2" sx={{ wordBreak: 'break-all', fontWeight: 500 }}>
              {publicKey.toBase58()}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" color="text.secondary" fontWeight={600}>
              Balance
            </Typography>
            <Box display="flex" alignItems="center" minHeight={40}>
              {balance === null ? (
                <CircularProgress size={24} color="primary" />
              ) : (
                <Typography variant="h5" color="primary" fontWeight={700}>
                  {balance?.toFixed(3) ?? '--'} SOL
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function Content({ colorMode, mode }) {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  // Listen for balance loading state
  // (handled in WalletInfo by showing spinner when balance is null)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: mode === 'dark'
          ? `linear-gradient(135deg, ${theme.palette.grey[900]}, ${theme.palette.grey[800]})`
          : `linear-gradient(135deg, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Avatar sx={{ bgcolor: 'white', color: 'primary.main', mr: 2 }}>
            <AccountBalanceWalletIcon />
          </Avatar>
          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Solana Wallet
          </Typography>
          <IconButton color="inherit" onClick={colorMode.toggleColorMode}>
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box width="100%">
          <Card elevation={8} sx={{ borderRadius: 4, p: { xs: 2, sm: 4 }, boxShadow: 6 }}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
              <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mt: 1, fontFamily: 'Inter, Roboto, sans-serif' }}>
                Solana Wallet Connect
              </Typography>
              <Divider sx={{ width: '100%', mb: 2 }} />
              <StyledWalletButton fullWidth sx={{ mt: 1, mb: 2 }} />
              <WalletInfo loading={loading} />
            </Box>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}

function App() {
  const [mode, setMode] = useState('light');
  const colorMode = {
    toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  };
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode,
        primary: {
          main: '#4f46e5',
        },
        background: {
          default: mode === 'dark' ? '#18181b' : '#f3f4f6',
          paper: mode === 'dark' ? '#23232a' : '#fff',
        },
      },
      typography: {
        fontFamily: 'Inter, Roboto, sans-serif',
      },
    }), [mode]);

  const endpoint = useMemo(() => clusterApiUrl("devnet"), []);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <Content colorMode={colorMode} mode={mode} />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
}

export default App;
