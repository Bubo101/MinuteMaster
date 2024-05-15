import React, { useState, useRef } from 'react';
import axios from 'axios';
import AudioUpload from './AudioUpload';

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioRef = useRef();

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        recorder.onstart = () => setIsRecording(true);
        let audioChunks = [];

        recorder.ondataavailable = (e) => audioChunks.push(e.data);

        recorder.onstop = async () => {
          setIsRecording(false);
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          audioRef.current.src = audioUrl;

          // Optionally upload the audio file to the server here
          const formData = new FormData();
          formData.append('meetingAudio', audioBlob, 'recording.wav');
          try {
            await axios.post('http://localhost:3001/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            console.log('File uploaded successfully');
          } catch (error) {
            console.error('Error uploading file:', error);
          }
        };

        recorder.start();
      } catch (error) {
        console.error('Error accessing the microphone:', error);
      }
    } else {
      alert('Audio recording is not supported in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  return (
    <div>
      <button onClick={startRecording} disabled={isRecording}>Start Recording</button>
      <button onClick={stopRecording} disabled={!isRecording}>Stop Recording</button>
      <audio ref={audioRef} controls />
      <div>
        <AudioUpload />
      </div>
    </div>
  );
}

export default AudioRecorder;
