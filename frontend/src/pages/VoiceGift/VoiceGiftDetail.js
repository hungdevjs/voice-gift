import { useState, useRef, useEffect, useId, useMemo } from 'react';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { useSnackbar } from 'notistack';

import Input from './components/Input';
import useAppContext from '../../hooks/useAppContext';
import useResponsive from '../../hooks/useReponsive';
import useRecorder from '../../hooks/useRecorder';
import { create } from '../../services/voiceGift.service';
import { uploadFile } from '../../services/firebase.service';

const MAX_FILE_SIZE = 5242880;

const VoiceGiftDetail = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isRecording, recordingTime, start, stop, recordFile } = useRecorder();
  const { isMobile } = useResponsive();
  const theme = useTheme();
  const {
    accountState: { user },
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
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customBackground, setCustomBackground] = useState(null);
  const [customAudio, setCustomAudio] = useState(null);
  const avatarInputId = useId();
  const customBackgroundInputId = useId();
  const customAudioInputId = useRef();
  const labelRef = useRef([]);

  const background = backgroundId
    ? backgrounds.find((item) => item.id === backgroundId)
    : null;
  const audio = useMemo(
    () =>
      audioId === 0
        ? customAudio
          ? { bgUrl: URL.createObjectURL(customAudio) }
          : null
        : musics.find((item) => item.id === audioId),
    [customAudio, musics, audioId]
  );

  useEffect(() => {
    if (!customBackground) {
      setBackgroundId('1');
    }
  }, [customBackground]);

  useEffect(() => {
    if (!customAudio) {
      setAudioId('1');
    }
  }, [customAudio]);

  useEffect(() => {
    const activeAudioItem =
      activeAudio.id === 0
        ? customAudio
          ? { url: URL.createObjectURL(customAudio) }
          : null
        : musics.find((item) => item.id === activeAudio.id);
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

  const handleAvatarInputChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) throw new Error('Max file size is 5MB');
      setAvatar(file);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    e.target.value = '';
  };
  const handleBackgroundInputChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) throw new Error('Max file size is 5MB');
      setCustomBackground(file);
      setBackgroundId(0);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    e.target.value = '';
  };
  const handleAudioInputChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file.size > MAX_FILE_SIZE) throw new Error('Max file size is 5MB');
      setCustomAudio(file);
      setAudioId(0);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    e.target.value = '';
  };

  const PreviewContainer = isMobile ? Box : DeviceFrameset;
  const previewContainerProps = isMobile
    ? { borderRadius: 4, border: '1px solid #ccc' }
    : { device: 'iPhone X', color: 'gold' };

  const togglePlayingPreview = () => {
    setIsPlayingPreview(!isPlayingPreview);
  };

  const previewRecordRef = useRef();
  const previewAudioRef = useRef();
  useEffect(() => {
    if (isPlayingPreview) {
      setActiveAudio({ id: null, isPlaying: false });
      if (recorderAudioRef.current) {
        recorderAudioRef.current.pause();
        recorderAudioRef.current.currentTime = 0;
      }

      if (previewAudioRef.current) {
        previewAudioRef.current.volume = 0.1;
        previewAudioRef.current.currentTime = 0;
        previewAudioRef.current.play();
      }

      if (previewRecordRef.current) {
        previewRecordRef.current.currentTime = 0;
        previewRecordRef.current.play();
      }
    } else {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }

      if (previewRecordRef.current) {
        previewRecordRef.current.pause();
      }
    }
  }, [isPlayingPreview]);

  useEffect(() => {
    if (audio) {
      previewAudioRef.current?.load();
      setIsPlayingPreview(false);
    }
  }, [audio]);

  const submit = async () => {
    setIsLoading(true);
    try {
      if (!name || !name.trim()) throw new Error('Name is empty');
      if (!title || !title.trim()) throw new Error('Name is empty');
      if (!text || !text.trim()) throw new Error('Name is empty');

      const data = {
        name,
        title,
        text,
        backgroundId,
        audioId,
      };

      if (user) {
        if (backgroundId === 0) {
          if (!customBackground)
            throw new Error('Error in uploading custom background: No file!');
          const backgroundRef = await uploadFile(customBackground);
          data.customBackground = backgroundRef;
        }

        if (audioId === 0) {
          if (!customAudio)
            throw new Error('Error in uploading custom audio: No file!');
          const audioRef = await uploadFile(customAudio);
          data.customAudio = audioRef;
        }
      }

      if (recordFile) {
        const record = await uploadFile(recordFile);
        data.record = record;
      }

      if (typeof avatar !== 'string') {
        const avatarRef = await uploadFile(avatar);
        data.avatar = avatarRef;
      }

      const res = await create(data);
      navigate(`/voice-gifts/${res.data}/qr`);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: 'error' });
    }
    setIsLoading(false);
  };

  return (
    <Box>
      <label
        htmlFor={avatarInputId}
        ref={(node) => (labelRef.current[0] = node)}
        style={{ display: 'none' }}
      />
      <input
        id={avatarInputId}
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        onChange={handleAvatarInputChange}
      />
      <label
        htmlFor={customBackgroundInputId}
        ref={(node) => (labelRef.current[1] = node)}
        style={{ display: 'none' }}
      />
      <input
        id={customBackgroundInputId}
        style={{ display: 'none' }}
        type="file"
        accept="image/*"
        onChange={handleBackgroundInputChange}
      />
      <label
        htmlFor={customAudioInputId}
        ref={(node) => (labelRef.current[2] = node)}
        style={{ display: 'none' }}
      />
      <input
        id={customAudioInputId}
        style={{ display: 'none' }}
        type="file"
        accept="audio/*"
        onChange={handleAudioInputChange}
      />
      <Box display="none">
        {audio && (
          <audio
            ref={previewAudioRef}
            preload="auto"
            onEnded={() => {
              previewRecordRef.current?.pause();
              setIsPlayingPreview(false);
            }}
          >
            <source src={audio.bgUrl} alt="audio" />
          </audio>
        )}
        {recordFile && (
          <audio
            ref={previewRecordRef}
            preload="auto"
            onEnded={() => {
              previewAudioRef.current?.pause();
              setIsPlayingPreview(false);
            }}
          >
            <source src={URL.createObjectURL(recordFile)} alt="audio" />
          </audio>
        )}
      </Box>
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
          <CircularProgress size={30} sx={{ color: theme.colors.primary }} />
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
                      onClick={() => labelRef.current[0]?.click()}
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
                  {user && (
                    <>
                      {customBackground ? (
                        <Box
                          flexShrink={0}
                          position="relative"
                          overflow="hidden"
                          sx={{
                            '&:hover > .overlay': {
                              opacity: 1,
                            },
                          }}
                        >
                          <img
                            src={URL.createObjectURL(customBackground)}
                            alt="bg"
                            style={{
                              display: 'block',
                              width: '200px',
                              height: '100%',
                              objectFit: 'cover',
                              objectPosition: 'center',
                              borderRadius: 16,
                              border: `2px solid ${
                                !backgroundId
                                  ? theme.colors.primary
                                  : 'transparent'
                              }`,
                              cursor: 'pointer',
                            }}
                            onClick={() => setBackgroundId(0)}
                          />
                          <Box
                            className="overlay"
                            position="absolute"
                            bottom={0}
                            left={0}
                            width="196px"
                            px={2}
                            py={1}
                            m="2px"
                            bgcolor={alpha('#000', 0.4)}
                            border="2px solid transparent"
                            boxSizing="padding-box"
                            display="flex"
                            alignItems="center"
                            gap={2}
                            sx={{
                              borderBottomLeftRadius: '14px',
                              borderBottomRightRadius: '14px',
                              transition: 'all ease 0.5s',
                              opacity: 0,
                            }}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              sx={{
                                flex: 1,
                                fontSize: '8px',
                                textTransform: 'none',
                                px: 0,
                                py: 0.5,
                              }}
                              onClick={() => labelRef.current[1]?.click()}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              sx={{
                                flex: 1,
                                fontSize: '8px',
                                textTransform: 'none',
                                px: 0,
                                py: 0.5,
                              }}
                              onClick={() => setCustomBackground(null)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          flexShrink={0}
                          width="200px"
                          p={2}
                          borderRadius={4}
                          border="1px solid #ccc"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          gap={1}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => labelRef.current[1]?.click()}
                        >
                          <CloudUploadIcon
                            sx={{ color: '#888', fontSize: 40 }}
                          />
                          <Typography
                            fontSize="14px"
                            color="#888"
                            align="center"
                          >
                            Upload your background
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
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
                  {user && (
                    <>
                      {customAudio ? (
                        <Box
                          flexShrink={0}
                          width="200px"
                          p={2}
                          position="relative"
                          overflow="hidden"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          gap={1}
                          borderRadius={4}
                          border={`2px solid ${
                            audioId === 0 ? theme.colors.primary : '#ccc'
                          }`}
                          sx={{
                            '&:hover > .overlay': {
                              opacity: 1,
                            },
                          }}
                          onClick={() => setAudioId(0)}
                        >
                          <Typography
                            fontWeight={600}
                            align="center"
                            sx={{
                              display: '-webkit-box',
                              WebkitBoxOrient: 'vertical',
                              WebkitLineClamp: 1,
                              overflow: 'hidden',
                            }}
                          >
                            {customAudio.name}
                          </Typography>
                          <Typography fontWeight={600} align="center">
                            ({customAudio.duration}s)
                          </Typography>
                          <Box display="flex" justifyContent="center">
                            <Box
                              sx={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveAudio({
                                  id: 0,
                                  isPlaying:
                                    activeAudio.id === 0
                                      ? !activeAudio.isPlaying
                                      : true,
                                });
                              }}
                            >
                              {activeAudio.id === 0 && activeAudio.isPlaying ? (
                                <StopCircleIcon />
                              ) : (
                                <PlayCircleIcon />
                              )}
                            </Box>
                          </Box>
                          <img
                            src="/images/audio.jpg"
                            alt="audio"
                            style={{ width: '100%' }}
                          />
                          <Box
                            className="overlay"
                            position="absolute"
                            bottom={0}
                            left={0}
                            width="196px"
                            px={2}
                            py={1}
                            bgcolor={alpha('#000', 0.4)}
                            border="2px solid transparent"
                            boxSizing="padding-box"
                            display="flex"
                            alignItems="center"
                            gap={2}
                            sx={{
                              borderBottomLeftRadius: '14px',
                              borderBottomRightRadius: '14px',
                              transition: 'all ease 0.5s',
                              opacity: 0,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              sx={{
                                flex: 1,
                                fontSize: '8px',
                                textTransform: 'none',
                                px: 0,
                                py: 0.5,
                              }}
                              onClick={() => labelRef.current[2]?.click()}
                            >
                              Edit
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              color="error"
                              sx={{
                                flex: 1,
                                fontSize: '8px',
                                textTransform: 'none',
                                px: 0,
                                py: 0.5,
                              }}
                              onClick={() => setCustomAudio(null)}
                            >
                              Remove
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Box
                          flexShrink={0}
                          width="200px"
                          p={2}
                          borderRadius={4}
                          border="1px solid #ccc"
                          display="flex"
                          flexDirection="column"
                          alignItems="center"
                          justifyContent="center"
                          gap={1}
                          sx={{ cursor: 'pointer' }}
                          onClick={() => labelRef.current[2]?.click()}
                        >
                          <CloudUploadIcon
                            sx={{ color: '#888', fontSize: 40 }}
                          />
                          <Typography
                            fontSizt="14px"
                            color="#888"
                            align="center"
                          >
                            Upload your audio
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
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
                      <Typography
                        fontWeight={600}
                        align="center"
                        sx={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 1,
                          overflow: 'hidden',
                        }}
                      >
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
                      <img
                        src="/images/audio.jpg"
                        alt="audio"
                        style={{ width: '100%' }}
                      />
                    </Box>
                  ))}
                </ScrollContainer>
              </Box>
              <Box>
                <Typography>Record your voice (30s maximum)</Typography>
                {!isRecording && recordFile ? (
                  <Box display="flex" alignItems="center" gap={1}>
                    <audio controls>
                      <source src={URL.createObjectURL(recordFile)} />
                    </audio>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={start}
                    >
                      <Typography fontSize="12px" textTransform="none">
                        Redo
                      </Typography>
                    </Button>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center" gap={2}>
                    <RadioButtonCheckedIcon
                      sx={{
                        color: isRecording
                          ? theme.palette.error.main
                          : theme.palette.success.main,
                        cursor: 'pointer',
                        fontSize: 50,
                      }}
                      onClick={() => (isRecording ? stop() : start())}
                    />
                    <Typography>
                      {`${100 + Math.min(recordingTime, 30)}`.slice(-2)}s
                    </Typography>
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
                        src={
                          backgroundId === 0
                            ? customBackground
                              ? URL.createObjectURL(customBackground)
                              : ''
                            : background?.url
                        }
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
