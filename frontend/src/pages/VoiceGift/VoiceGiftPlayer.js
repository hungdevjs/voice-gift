import { useState, useEffect, useRef, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  alpha,
  CircularProgress,
  useTheme,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { faker } from '@faker-js/faker';

import { get } from '../../services/voiceGift.service';
import useAppContext from '../../hooks/useAppContext';

const VoiceGiftPlayer = () => {
  const theme = useTheme();
  const { id } = useParams();
  const {
    freeBackgroundState: { backgrounds },
    freeMusicState: { musics },
  } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState([]);

  const { name, title, text, audioId, backgroundId, avatar, record } =
    data || {};
  const background = backgroundId
    ? backgrounds.find((item) => item.id === backgroundId)
    : null;

  const audio = audioId ? musics.find((item) => item.id === audioId) : null;

  const togglePlaying = () => setIsPlaying(!isPlaying);

  const getData = async () => {
    setIsLoading(true);

    try {
      const res = await get(id);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [id]);

  const recordRef = useRef();
  const audioRef = useRef();
  useEffect(() => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (recordRef.current) {
        recordRef.current.pause();
        recordRef.current = null;
      }

      if (audio) {
        audioRef.current = new Audio(audio.bgUrl || audio.url);
        audioRef.current.volume = 0.1;
      }

      if (record) {
        recordRef.current = new Audio(record);
      }

      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.addEventListener('ended', () => {
          recordRef.current?.pause();
          setIsPlaying(false);
        });
      }

      if (recordRef.current) {
        recordRef.current.play();
        recordRef.current.addEventListener('ended', () => {
          audioRef.current?.pause();
          setIsPlaying(false);
        });
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (recordRef.current) {
        recordRef.current.pause();
        recordRef.current = null;
      }
    }
  }, [isPlaying]);

  const renderedAvatar = useMemo(
    () => avatar || faker.internet.avatar(),
    [avatar]
  );

  if (!data)
    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <Typography>Loading voice gift...</Typography>
        <CircularProgress size={30} sx={{ color: theme.colors.primary }} />
      </Box>
    );

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Box py={4} px={2} maxWidth="400px">
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
          <Box borderRadius={4} overflow="hidden" position="relative">
            <img
              src={background?.url}
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
                opacity: loaded[1] ? 1 : 0,
                transition: 'all ease 0.3s',
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
        <img src="/images/logo.png" alt="logo" style={{ width: 30 }} />
      </Box>
    </Box>
  );
};

export default VoiceGiftPlayer;
