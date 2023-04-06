import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  useTheme,
  Button,
} from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import QRCode from 'react-qr-code';
import { useSnackbar } from 'notistack';

import { auth } from '../../configs/firebase.config';

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { colors } = useTheme();

  const canLogin = email && email.trim() && password && password.trim();
  const login = async () => {
    if (!canLogin) return;

    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }

    setIsLoading(false);
  };

  return (
    <Box minHeight="100vh">
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          item
          xs={0}
          sm={0}
          md={5}
          height="100%"
          sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
        >
          <Box
            height="100%"
            width="100%"
            overflow="hidden"
            px={2}
            py={4}
            bgcolor={colors.primary}
            display="flex"
            flexDirection="column"
          >
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
              <QRCode
                value="https://voicegift.web.app/voice-gifts/6acxRVnFa7Pn195yFCNI"
                size={80}
                style={{ borderRadius: 4 }}
              />
            </Box>
            <Typography fontSize="50px" fontWeight={600} color="white">
              VoiceGift
            </Typography>
            <Typography fontSize="20px" color="white">
              Don't forget to spread love everyday.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={7}>
          <Box
            px={2}
            py={4}
            height="100%"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <img
              src="/images/logo.png"
              alt="logo"
              style={{ width: 60, aspectRatio: '1/1' }}
            />
            <Box maxWidth="90%" width="500px">
              <Typography fontSize="40px" align="center">
                Hello again!
              </Typography>
              <Typography color="#888" align="center">
                Login to your premium account to create your own custom digital
                gift and send it to your lovers now!
              </Typography>
            </Box>
            <Box
              mt={2}
              maxWidth="90%"
              width="400px"
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                '& label.Mui-focused': {
                  color: colors.primary,
                },
                '& .MuiInput-underline:after': {
                  borderBottomColor: colors.primary,
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#888',
                  },
                  '&:hover fieldset': {
                    borderColor: '#888',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: colors.primary,
                  },
                },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                sx={{
                  color: colors.primary,
                }}
              />
              <TextField
                fullWidth
                variant="outlined"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                sx={{
                  color: colors.primary,
                }}
              />
            </Box>
            <Box
              width="400px"
              maxWidth="90%"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography
                fontSize="13px"
                color="#888"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate('/create-account')}
              >
                Require premium account
              </Typography>
              <Typography
                fontSize="13px"
                color="#888"
                align="right"
                sx={{
                  cursor: 'pointer',
                  '&:hover': { textDecoration: 'underline' },
                }}
                onClick={() => navigate('/forgot-password')}
              >
                Fotgot password?
              </Typography>
            </Box>
            <Box maxWidth="90%" width="400px">
              <Box
                px={4}
                py={1}
                borderRadius={1}
                bgcolor={colors.primary}
                sx={{
                  cursor: canLogin && !isLoading ? 'pointer' : 'default',
                  opacity: canLogin && !isLoading ? 1 : 0.5,
                }}
                onClick={login}
              >
                <Typography fontWeight={600} color="white" align="center">
                  {isLoading ? 'Processing...' : 'Login'}
                </Typography>
              </Box>
              <Box mt={2} display="flex" justifyContent="center">
                <Typography
                  fontSize="14px"
                  color="#555"
                  align="center"
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                  onClick={() => navigate('/')}
                >
                  Back to home
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
