import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';

type AudioUploaderProps = {
  handleUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

const AudioUploader: React.FC<AudioUploaderProps> = ({ handleUpload }) => {
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (file.type !== 'audio/mp3' && file.type !== 'audio/mpeg') {
        setErrorMessage('Please upload an MP3 file.');
      } else {
        setErrorMessage('');
        handleUpload(event);
      }
    }
  };

  return (
    <Container>
      <input type='file' accept='.mp3' onChange={handleFileUpload} />
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </Container>
  );
};

const Container = styled.div`
  margin-left: 20px;
`;

export default AudioUploader;
