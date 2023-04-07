import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  alpha,
  CircularProgress,
  useTheme,
  Dialog,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { faker } from '@faker-js/faker';

import { get } from '../../services/voiceGift.service';

const VoiceGiftPlayer = () => {
  const theme = useTheme();
  const { id } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState([]); // [avatar, background image, background audio, record audio]

  const { name, title, text, avatar, record, background, audio } = data || {};

  const togglePlaying = () => setIsPlaying(!isPlaying);

  const getData = async () => {
    try {
      const res = await get(id);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  const recordRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.volume = 0.1;
        audioRef.current.play();
      }

      if (recordRef.current) {
        recordRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      if (recordRef.current) {
        recordRef.current.pause();
        recordRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (data) {
      if (!audio) {
        setLoaded((prevLoaded) => {
          const nextLoaded = [...prevLoaded];
          nextLoaded[2] = true;
          return nextLoaded;
        });
      }

      if (!record) {
        setLoaded((prevLoaded) => {
          const nextLoaded = [...prevLoaded];
          nextLoaded[3] = true;
          return nextLoaded;
        });
      }
    }
  }, [data]);

  const interval = useRef();
  useEffect(() => {
    interval.current = setInterval(() => {
      let audioDone = false;
      let recordDone = false;
      if (audioRef.current) {
        audioRef.current.load();
        audioDone = true;
      } else if (data) {
        audioDone = true;
      }

      if (recordRef.current) {
        recordRef.current.load();
        recordDone = true;
      } else if (data) {
        recordDone = true;
      }

      if (audioDone && recordDone) {
        clearInterval(interval.current);
      }
    }, 1000);

    return () => clearInterval(interval.current);
  }, []);

  const renderedAvatar = useMemo(
    () => avatar || faker.internet.avatar(),
    [avatar]
  );

  const playerReady = loaded[1] && loaded[2] && loaded[3];

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Dialog open={!playerReady} fullScreen>
        <Box
          height="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Typography>Loading voice gift...</Typography>
          <CircularProgress size={30} sx={{ color: theme.colors.primary }} />
        </Box>
      </Dialog>
      {data && (
        <>
          <Box display="none">
            {audio && (
              <audio
                ref={audioRef}
                preload="auto"
                onEnded={() => {
                  setIsPlaying(false);
                }}
                onCanPlayThrough={() =>
                  setLoaded((prevLoaded) => {
                    const nextLoaded = [...prevLoaded];
                    nextLoaded[2] = true;
                    return nextLoaded;
                  })
                }
              >
                <source src={audio} alt="audio" />
              </audio>
            )}
            {record && (
              <audio
                ref={recordRef}
                preload="auto"
                onEnded={() => {
                  setIsPlaying(false);
                }}
                onCanPlayThrough={() =>
                  setLoaded((prevLoaded) => {
                    const nextLoaded = [...prevLoaded];
                    nextLoaded[3] = true;
                    return nextLoaded;
                  })
                }
              >
                <source src={record} alt="record" />
              </audio>
            )}
          </Box>
          <Box py={4} px={2} flex={1} maxWidth="400px">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <img
                  src={renderedAvatar}
                  alt="avatar"
                  onLoad={() =>
                    setLoaded((prevLoaded) => {
                      const nextLoaded = [...prevLoaded];
                      nextLoaded[0] = true;
                      return nextLoaded;
                    })
                  }
                  style={{
                    width: '25%',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    borderRadius: '50%',
                    opacity: loaded[0] ? 1 : 0,
                    transition: 'all ease 0.3s',
                  }}
                />
                <Box>
                  <Typography fontWeight={700}>{title}</Typography>
                  <Typography fontSize="12px">
                    by{' '}
                    <span
                      style={{
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      {name}
                    </span>
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography fontStyle="italic">{text}</Typography>
              </Box>
              <Box
                borderRadius={4}
                overflow="hidden"
                position="relative"
                sx={{
                  opacity: playerReady ? 1 : 0,
                  transition: 'all ease 0.3s',
                }}
              >
                <img
                  src={background}
                  alt="background"
                  onLoad={() =>
                    setLoaded((prevLoaded) => {
                      const nextLoaded = [...prevLoaded];
                      nextLoaded[1] = true;
                      return nextLoaded;
                    })
                  }
                  style={{
                    display: 'block',
                    width: '100%',
                  }}
                />
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor={isPlaying ? 'transparent' : alpha('#000', 0.3)}
                  sx={{ cursor: 'pointer' }}
                  onClick={togglePlaying}
                >
                  {!isPlaying && (
                    <PlayCircleIcon
                      sx={{
                        color: 'white',
                        fontSize: '40px',
                      }}
                    />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box
            width="100%"
            p={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            gap={1}
            sx={{ borderTop: '1px solid #ccc' }}
          >
            <Typography
              fontWeight={600}
              color={theme.colors.primary}
              align="center"
              sx={{ cursor: 'pointer' }}
              onClick={() => window.open(window.location.origin)}
            >
              Create your voice gift back for them now!
            </Typography>
            {/* <img src="/images/logo.png" alt="logo" style={{ width: 30 }} /> */}
          </Box>
        </>
      )}
    </Box>
  );
};

export default VoiceGiftPlayer;
