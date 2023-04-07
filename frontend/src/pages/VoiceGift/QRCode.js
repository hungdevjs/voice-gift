import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, useTheme } from '@mui/material';
import ReactQRCode from 'react-qr-code';
import { toJpeg } from 'html-to-image';

const QRCode = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const value = window.location.href.slice(0, -3);

  const download = async () => {
    const dataUrl = await toJpeg(document.getElementById('qr-code-container'), {
      quality: 0.95,
    });

    const link = document.createElement('a');
    link.download = 'QRCode-VoiceGift.jpeg';
    link.href = dataUrl;
    link.click();
  };

  return (
    <Box>
      <Container>
        <Box
          minHeight="100vh"
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
          <Typography>Scan this QR code to view your voice gift!</Typography>
          <Box p={2} id="qr-code-container">
            <ReactQRCode value={value} />
          </Box>
          <Box
            px={2}
            py={1}
            bgcolor={theme.colors.primary}
            borderRadius={6}
            onClick={download}
            sx={{
              cursor: 'pointer',
              transition: 'all ease 0.3s',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          >
            <Typography fontSize="14px" color="white">
              Download QR Code
            </Typography>
          </Box>
          <Box display="flex" justifyContent="center">
            <Typography
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
      </Container>
    </Box>
  );
};

export default QRCode;
