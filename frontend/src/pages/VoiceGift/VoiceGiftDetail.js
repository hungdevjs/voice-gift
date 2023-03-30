import { useState, useRef, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  alpha,
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Dialog,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { DeviceFrameset } from 'react-device-frameset';
import { faker } from '@faker-js/faker';
import ScrollContainer from 'react-indiana-drag-scroll';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useSnackbar } from 'notistack';

import Input from './components/Input';
import useAppContext from '../../hooks/useAppContext';
import useResponsive from '../../hooks/useReponsive';
import { create } from '../../services/voiceGift.service';

const VoiceGiftDetail = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const recorderControls = useAudioRecorder();
  const { isMobile } = useResponsive();
  const theme = useTheme();
  const {
    freeBackgroundState: { backgrounds },
    freeMusicState: { musics },
  } = useAppContext();
  const [loaded, setLoaded] = useState([]);
  const [avatar, setAvatar] = useState(faker.image.avatar());
  const [title, setTitle] = useState('I wish you a merry Christmas!');
  const [name, setName] = useState(faker.name.firstName());
  const [text, setText] = useState(faker.lorem.paragraph(5));
  const [audioId, setAudioId] = useState('1');
  const [backgroundId, setBackgroundId] = useState('1');
  const audioRef = useRef();
  const recorderAudioRef = useRef();
  const [activeAudio, setActiveAudio] = useState({
    id: null,
    isPlaying: false,
  });
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputId = useId();
  const labelRef = useRef();

  const background = backgroundId
    ? backgrounds.find((item) => item.id === backgroundId)
    : null;

  useEffect(() => {
    const activeAudioItem = musics.find((item) => item.id === activeAudio.id);
    if (activeAudioItem) {
      if (activeAudio.isPlaying) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        audioRef.current = new Audio(activeAudioItem.url);
        audioRef.current.play();
        audioRef.current.addEventListener('ended', () => {
          setActiveAudio({
            ...activeAudio,
            isPlaying: false,
          });
        });
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      }
    } else {
      audioRef.current?.pause();
      audioRef.current && (audioRef.current.currentTime = 0);
    }
  }, [activeAudio]);

  const handleInputChange = (e) => {
    setAvatar(e.target.files[0]);
    e.target.value = '';
  };

  const PreviewContainer = isMobile ? Box : DeviceFrameset;
  const previewContainerProps = isMobile
    ? { borderRadius: 4, border: '1px solid #ccc' }
    : { device: 'iPhone X', color: 'gold' };

  const addAudioElement = (blob) => {
    setAudioBlob(blob);
  };

  useEffect(() => {
    if (recorderControls.isRecording) {
      setAudioBlob(null);
    }
  }, [recorderControls.isRecording]);

  useEffect(() => {
    if (recorderControls.recordingTime >= 30) {
      recorderControls.stopRecording();
    }
  }, [recorderControls.recordingTime]);

  const togglePlayingPreview = () => {
    setIsPlayingPreview(!isPlayingPreview);
  };

  const previewRecordRef = useRef();
  const previewAudioRef = useRef();
  useEffect(() => {
    if (isPlayingPreview) {
      setActiveAudio({ id: null, isPlaying: false });
      recorderAudioRef.current?.pause();
      recorderAudioRef.current && (recorderAudioRef.current.currentTime = 0);

      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }

      if (previewRecordRef.current) {
        previewRecordRef.current.pause();
        previewRecordRef.current = null;
      }

      const audio = musics.find((item) => item.id === audioId);
      if (audio) {
        previewAudioRef.current = new Audio(audio.url);
        previewAudioRef.current.volume = 0.1;
      }

      if (audioBlob) {
        previewRecordRef.current = new Audio(URL.createObjectURL(audioBlob));
      }

      if (previewAudioRef.current) {
        previewAudioRef.current.play();
        previewAudioRef.current.addEventListener('ended', () => {
          previewRecordRef.current?.pause();
          setIsPlayingPreview(false);
        });
      }

      if (previewRecordRef.current) {
        previewRecordRef.current.play();
        previewRecordRef.current.addEventListener('ended', () => {
          previewAudioRef.current?.pause();
          setIsPlayingPreview(false);
        });
      }
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
        previewAudioRef.current = null;
      }

      if (previewRecordRef.current) {
        previewRecordRef.current.pause();
        previewRecordRef.current = null;
      }
    }
  }, [isPlayingPreview]);

  const submit = async () => {
    setIsLoading(true);
    try {
      if (!name || !name.trim()) throw new Error('Name is empty');
      if (!title || !title.trim()) throw new Error('Name is empty');
      if (!text || !text.trim()) throw new Error('Name is empty');

      const formData = new FormData();
      if (audioBlob) {
        const record = new File([audioBlob], 'record', {
          type: audioBlob.type,
        });
        formData.append('record', record, 'record');
      }

      if (typeof avatar !== 'string') {
        formData.append('avatar', avatar, 'avatar');
      }

      formData.append('name', name);
      formData.append('title', title);
      formData.append('text', text);
      formData.append('backgroundId', backgroundId);
      formData.append('audioId', audioId);

      const res = await create(formData);
      navigate(`/voice-gifts/${res.data}/qr`);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <Box>
      <label htmlFor={inputId} ref={labelRef} style={{ display: 'none' }} />
      <input
        id={inputId}
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
      />
      <Box
        height="50px"
        px={2}
        sx={{ borderBottom: '1px solid #ccc' }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        position="fixed"
        left={0}
        top={0}
        width="100vw"
        bgcolor="white"
        zIndex={99}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <img
            src="/images/logo.png"
            alt="logo"
            style={{ maxHeight: '40px' }}
          />
          <Typography fontWeight={700}>VoiceGift</Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          size="small"
          onClick={submit}
          sx={{ borderRadius: 4 }}
        >
          <CheckIcon sx={{ fontSize: '20px', mr: 1 }} />
          <Typography fontSize="12px" textTransform="none">
            Done
          </Typography>
        </Button>
      </Box>
      <Dialog open={isLoading} fullScreen>
        <Box
          p={2}
          height="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <Box>
            <Typography align="center">Creating voice gift...</Typography>
            <Typography align="center">Please don't close browser.</Typography>
          </Box>
          <CircularProgress color="primary" size={30} />
        </Box>
      </Dialog>
      <Container sx={{ mt: '50px' }}>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Box
              p={isMobile ? 0 : 2}
              py={2}
              display="flex"
              flexDirection="column"
              gap={1}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  position="relative"
                  borderRadius="50%"
                  overflow="hidden"
                  sx={{ '&:hover': { '& > .overlay': { opacity: 1 } } }}
                >
                  <img
                    src={
                      typeof avatar === 'string'
                        ? avatar
                        : URL.createObjectURL(avatar)
                    }
                    alt="avatar"
                    style={{
                      width: 80,
                      aspectRatio: '1/1',
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block',
                    }}
                  />
                  <Box
                    className="overlay"
                    position="absolute"
                    top={0}
                    left={0}
                    width="100%"
                    height="100%"
                    display="flex"
                    flexDirection="column"
                    justifyContent="flex-end"
                    bgcolor={alpha('#000', 0.3)}
                    sx={{ transition: 'all ease 0.3s', opacity: 0 }}
                  >
                    <Box
                      px={1}
                      py={0.5}
                      bgcolor={alpha('#000', 0.5)}
                      sx={{ cursor: 'pointer' }}
                      onClick={() => labelRef.current?.click()}
                    >
                      <Typography fontSize="12px" color="white" align="center">
                        Edit
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box flex={1}>
                  <Typography>Your name</Typography>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Typography fontSize="12px" fontStyle="italic" color="tomato">
                    *Your avatar will be randomly chosen if you don't change it
                  </Typography>
                </Box>
              </Box>
              <Box>
                <Typography>Title</Typography>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Box>
              <Box>
                <Typography>Text</Typography>
                <Input
                  type="textarea"
                  rows={5}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Box>
              <Box>
                <Typography>Background image</Typography>
                <ScrollContainer
                  style={{
                    height: '300px',
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                  }}
                >
                  {backgrounds.map((item, index) => (
                    <img
                      key={item.id}
                      src={item.url}
                      alt="bg"
                      style={{
                        width: '200px',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderRadius: 16,
                        border: `2px solid ${
                          item.id === backgroundId
                            ? theme.colors.primary
                            : 'transparent'
                        }`,
                        cursor: 'pointer',
                        transition: 'all ease 0.3s',
                        opacity: loaded[index] ? 1 : 0,
                      }}
                      onClick={() => setBackgroundId(item.id)}
                      onLoad={() =>
                        setLoaded((prevLoaded) => {
                          const nextLoaded = [...prevLoaded];
                          nextLoaded[index] = true;
                          return nextLoaded;
                        })
                      }
                    />
                  ))}
                </ScrollContainer>
              </Box>
              <Box>
                <Typography>Background music</Typography>
                <ScrollContainer
                  style={{
                    // height: '300px',
                    display: 'flex',
                    gap: 16,
                    overflowX: 'auto',
                  }}
                >
                  {musics.map((item) => (
                    <Box
                      key={item.id}
                      p={2}
                      borderRadius={4}
                      border={`2px solid ${
                        item.id === audioId ? theme.colors.primary : '#ccc'
                      }`}
                      flexShrink={0}
                      width="200px"
                      display="flex"
                      flexDirection="column"
                      gap={1}
                      onClick={() => setAudioId(item.id)}
                    >
                      <img
                        src="/images/audio.jpg"
                        alt="audio"
                        style={{ width: '100%' }}
                      />
                      <Typography fontWeight={600} align="center">
                        {item.name}
                      </Typography>
                      <Typography fontWeight={600} align="center">
                        ({item.length}s)
                      </Typography>
                      <Box display="flex" justifyContent="center">
                        <Box
                          sx={{ cursor: 'pointer' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveAudio({
                              id: item.id,
                              isPlaying:
                                activeAudio.id === item.id
                                  ? !activeAudio.isPlaying
                                  : true,
                            });
                          }}
                        >
                          {activeAudio.id === item.id &&
                          activeAudio.isPlaying ? (
                            <StopCircleIcon />
                          ) : (
                            <PlayCircleIcon />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </ScrollContainer>
              </Box>
              <Box>
                <Typography>Record your voice (30s maximum)</Typography>
                <Box
                  display={
                    !recorderControls.isRecording && audioBlob
                      ? 'none'
                      : 'block'
                  }
                >
                  <AudioRecorder
                    onRecordingComplete={addAudioElement}
                    recorderControls={recorderControls}
                  />
                </Box>
                {!recorderControls.isRecording && audioBlob && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <audio controls ref={recorderAudioRef}>
                      <source src={URL.createObjectURL(audioBlob)} />
                    </audio>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => setAudioBlob(null)}
                    >
                      <Typography fontSize="12px" textTransform="none">
                        Remove
                      </Typography>
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              height="100%"
              p={isMobile ? 0 : 2}
              py={2}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
            >
              <PreviewContainer {...previewContainerProps}>
                <Box py={isMobile ? 2 : 5} px={2} height="100%" overflow="auto">
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <img
                        src={
                          typeof avatar === 'string'
                            ? avatar
                            : URL.createObjectURL(avatar)
                        }
                        alt="avatar"
                        style={{
                          width: '25%',
                          aspectRatio: '1/1',
                          objectFit: 'cover',
                          objectPosition: 'center',
                          borderRadius: '50%',
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
                        style={{ display: 'block', width: '100%' }}
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
                        bgcolor={
                          isPlayingPreview ? 'transparent' : alpha('#000', 0.3)
                        }
                        sx={{ cursor: 'pointer' }}
                        onClick={togglePlayingPreview}
                      >
                        {!isPlayingPreview && (
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
              </PreviewContainer>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Box
        height="50px"
        px={2}
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="100vw"
        bgcolor="white"
        sx={{ borderTop: '1px solid #ccc', fontSize: '12px' }}
      >
        Made by hungdevjs with
        <KeyboardIcon
          sx={{ color: theme.palette.primary.main, mx: 0.5, fontSize: 18 }}
        />{' '}
        and
        <FavoriteIcon
          sx={{ color: theme.colors.primary, mx: 0.5, fontSize: 18 }}
        />
      </Box>
    </Box>
  );
};

export default VoiceGiftDetail;
