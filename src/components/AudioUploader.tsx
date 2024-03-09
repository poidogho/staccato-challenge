import React, { useState, ChangeEvent } from 'react';

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
    <div>
      <input type='file' accept='.mp3' onChange={handleFileUpload} />
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
    </div>
  );
};

export default AudioUploader;
