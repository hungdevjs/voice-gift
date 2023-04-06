import { useNavigate } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';

import useAppContext from '../../hooks/useAppContext';

const Home = () => {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const {
    accountState: { user },
  } = useAppContext();

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
            Start to create your digital gifts for free!
          </Typography>
          <Typography fontWeight={400} align="center">
            Sharing this app with your friends is incredible support for us.
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={1.5}
        >
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
            onClick={() => navigate('/voice-gifts/create')}
          >
            <Typography fontWeight={600} color="white">
              Create gift
            </Typography>
          </Box>
          {!user && (
            <Box>
              <Typography
                fontSize="14px"
                align="center"
                color="#555"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
                onClick={() => navigate('/login')}
              >
                Login/Create your premium account
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Box
          width="250px"
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
              width: 40,
              aspectRatio: '1/1',
              borderRadius: '50%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          <Box flex={1}>
            <Typography fontSize="12px" fontWeight={600}>
              hungdevjs
            </Typography>
            <Typography fontSize="10px" color="#555">
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
              <Typography fontSize="10px" fontWeight={600} color="white">
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
