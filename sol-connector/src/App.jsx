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
import SvgIcon from '@mui/material/SvgIcon';

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

function DiscordIcon(props) {
  // Official Discord SVG icon
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276c-.598.3428-1.2205.6447-1.8733.8923a.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1835 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
    </SvgIcon>
  );
}

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
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <IconButton
                component="a"
                href="https://discord.com/users/againtslawlight" // Replace with your Discord link
                target="_blank"
                rel="noopener"
                color="primary"
                sx={{ fontSize: 36 }}
              >
                <DiscordIcon fontSize="inherit" />
              </IconButton>
            </Box>
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
