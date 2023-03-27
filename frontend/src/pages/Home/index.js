import { Box, Button, Typography, useTheme } from '@mui/material';

const Home = () => {
  const { colors } = useTheme();

  return (
    <Box
      minHeight="100vh"
      p={2}
      bgcolor={colors.tertiary}
      display="flex"
      flexDirection="column"
    >
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={4}
      >
        <Box>
          <Typography
            fontWeight={600}
            fontSize={{
              xs: '60px',
              sm: '80px',
            }}
            align="center"
          >
            Voice Gift
          </Typography>
          <Typography fontWeight={400} align="center">
            Start to create your voice gift for free!
          </Typography>
          <Typography fontWeight={400} align="center">
            Sharing this app with your friends is incredible support for us.
          </Typography>
        </Box>
        <Box
          px={4}
          py={1}
          borderRadius={8}
          bgcolor={colors.primary}
          sx={{
            cursor: 'pointer',
            transition: 'all ease 0.3s',
            '&:hover': { transform: 'scale(1.05)' },
          }}
        >
          <Typography fontWeight={600} color="white">
            Create gift
          </Typography>
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Box
          width="350px"
          maxWidth="90vw"
          p={1.5}
          bgcolor="white"
          borderRadius={10}
          display="flex"
          alignItems="center"
          gap={1}
        >
          <img
            src="/images/avatar.jpeg"
            alt="avatar"
            style={{
              width: 50,
              aspectRatio: '1/1',
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <Box flex={1}>
            <Typography fontWeight={600}>hungdevjs</Typography>
            <Typography fontSize="12px" color="#888">
              Fullstack engineer
            </Typography>
          </Box>
          <Box>
            <Box
              bgcolor={colors.primary}
              borderRadius={8}
              px={2}
              py={0.75}
              sx={{
                cursor: 'pointer',
              }}
              onClick={() => window.open('https://hungdevjs.web.app')}
            >
              <Typography fontSize="12px" fontWeight={600} color="white">
                Follow
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
