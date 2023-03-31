import { useState, useRef, useEffect } from 'react';
import MicRecorder from 'mic-recorder-to-mp3';

const useRecorder = () => {
  const recorderRef = useRef();
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordFile, setRecordFile] = useState(null);

  const interval = useRef();
  useEffect(() => {
    if (isRecording) {
      interval.current = setInterval(
        () => setRecordingTime((prevTime) => prevTime + 1),
        1000
      );
    } else {
      if (interval.current) {
        clearInterval(interval.current);
        interval.current = undefined;
      }
    }
  }, [isRecording]);

  useEffect(() => {
    if (recordingTime > 30) {
      stop();
    }
  }, [recordingTime]);

  const start = async () => {
    try {
      setRecordFile(null);
      recorderRef.current = new MicRecorder({
        bitRate: 128,
      });

      await recorderRef.current.start();
      setRecordingTime(0);
      setIsRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stop = async () => {
    try {
      const [buffer, blob] = await recorderRef.current.stop().getMp3();
      const file = new File(buffer, 'record.mp3', {
        type: blob.type,
        lastModified: Date.now(),
      });
      setRecordFile(file);
      setIsRecording(false);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    isRecording,
    recordingTime,
    start,
    stop,
    recordFile,
  };
};

export default useRecorder;
