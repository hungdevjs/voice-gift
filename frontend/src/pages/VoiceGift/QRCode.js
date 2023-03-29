import { Box, Button, Container, Typography } from '@mui/material';
import ReactQRCode from 'react-qr-code';
import { toJpeg } from 'html-to-image';

const QRCode = () => {
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
          <Typography>Scan this QR code to view your voice gift!</Typography>
          <Box p={2} id="qr-code-container">
            <ReactQRCode value={value} />
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={download}
          >
            Download QR Code
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default QRCode;
