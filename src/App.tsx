import React, { ChangeEvent, useState } from 'react';
import AudioUploader from './components/AudioUploader';
import Header from './components/Header';
import SoundWave from './components/Soundwave';

const App: React.FC = () => {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [originalAudioBuffer, setOriginalAudioBuffer] = useState<
    ArrayBuffer | string | null
  >(null);

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
        const buffer = loadEvent.target?.result;

        const url = URL.createObjectURL(file);
        setAudioUrl(url);
        setOriginalAudioBuffer(buffer as ArrayBuffer);
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <>
      <Header headerText='Staccato AI Wave Challenge' />
      <AudioUploader handleUpload={handleUpload} />
      {audioUrl && (
        <SoundWave
          url={audioUrl}
          audioBuffer={originalAudioBuffer as ArrayBuffer}
        />
      )}
    </>
  );
};

export default App;
