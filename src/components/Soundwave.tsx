/* eslint-disable @typescript-eslint/no-explicit-any */
//@ts-expect-error js dist error
import RegionsPlugin from 'wavesurfer.js/dist/plugins/regions';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import styled from 'styled-components';
import { WaveSurfer, WaveForm, Region } from 'wavesurfer-react';
import { Box, Button } from '@mui/material';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import LoopModal from './LoopModal';
import { trimWave } from '../utils/soundwave';

// https://codesandbox.io/p/sandbox/wavesurfer-react-3-0-w8vr3m?file=%2Fsrc%2Findex.js%3A332%2C5

function generateNum(min: number, max: number) {
  return Math.random() * (max - min + 1) + min;
}

type SoundWaveProps = {
  url: string;
  audioBuffer: ArrayBuffer;
};
const SoundWave: React.FC<SoundWaveProps> = ({ url, audioBuffer }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  const plugins = useMemo(() => {
    return [
      {
        key: 'regions',
        plugin: RegionsPlugin,
        options: { dragSelection: true },
      },
    ];
  }, []);

  const [regions, setRegions] = useState<any>([]);

  const regionsRef = useRef(regions);

  useEffect(() => {
    console.log('regions useEffect');
    regionsRef.current = regions;
  }, [regions]);

  useEffect(() => {
    if (wavesurferRef.current && url) {
      wavesurferRef.current.load(url);
      // Clear existing regions if you want to start fresh with each new audio
      setRegions([]);
      setIsPlaying(false);
    }
  }, [url]);

  const regionCreatedHandler = useCallback(
    (region: any) => {
      console.log('region-created --> region:', region);

      if (region.data.systemRegionId) return;

      setRegions([
        ...regionsRef.current,
        { ...region, data: { ...region.data, systemRegionId: -1 } },
      ]);
    },
    [regionsRef]
  );

  const wavesurferRef = useRef<any>();

  const handleWSMount = useCallback(
    (waveSurfer: any) => {
      wavesurferRef.current = waveSurfer;

      if (wavesurferRef.current) {
        wavesurferRef.current.load(url);

        wavesurferRef.current.on('region-created', regionCreatedHandler);

        wavesurferRef.current.on('ready', () => {
          setIsLoaded(true);
        });

        if (window) {
          // @ts-expect-error setting value for window object
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [regionCreatedHandler, url]
  );

  const generateRegion = useCallback(() => {
    if (!wavesurferRef.current) return;

    const r = generateNum(0, 255);
    const g = generateNum(0, 255);
    const b = generateNum(0, 255);

    setRegions([
      ...regions,
      {
        id: `custom-${generateNum(0, 9999)}`,
        start: 2,
        end: 10,
        color: `rgba(${r}, ${g}, ${b}, 0.5)`,
      },
    ]);

    console.log({ wavesurferRef });
  }, [regions, wavesurferRef]);

  const play = useCallback(() => {
    setIsPlaying(!isPlaying);
    wavesurferRef.current.playPause();
  }, [isPlaying]);

  const stopPlay = () => {
    setIsPlaying(false);
    wavesurferRef.current.stop();
  };

  const loopRegion = () => {
    setIsPlaying(true);
    const region = wavesurferRef.current.getActivePlugins()[0].regions[0];
    console.log({ region }, wavesurferRef.current);

    if (!region) {
      console.error('Region not found:');
      return;
    }

    region.play(region.start, region.end);
  };

  const cutAWave = () => {
    trimWave(wavesurferRef.current, audioBuffer);
    setRegions([]);
  };

  const handleOnLeave = () => {
    const region = wavesurferRef.current.getActivePlugins()[0].regions[0];
    if (loopCount > 0) {
      region.play();
      setLoopCount(loopCount - 1);
    }
    if (loopCount < 0) {
      region.play();
    }
  };

  const submitLoopNum = (isInfinity: boolean, numOfLoop: number) => {
    loopRegion();
    setLoopCount(!isInfinity ? numOfLoop : -1);
  };

  return (
    <Container className='App'>
      <WaveSurfer
        plugins={plugins}
        onMount={handleWSMount}
        cursorColor='transparent'
        container='#waveform'
        waveColor='#749BD4'
      >
        {/* @ts-expect-error id invalidated */}
        <WaveForm>
          {isLoaded &&
            regions.map((regionProps: any) => (
              <Region
                key={regionProps.id}
                {...regionProps}
                onOut={handleOnLeave}
              />
            ))}
        </WaveForm>
        <div id='timeline' />
      </WaveSurfer>
      <Buttons>
        <Button onClick={play}>
          {isPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
        </Button>
        <Button onClick={stopPlay}>
          <StopCircleIcon />
        </Button>
        {regions?.length ? (
          <>
            <Button variant='outlined' onClick={cutAWave}>
              Cut Wave
            </Button>
            <LoopModal submitLoopNum={submitLoopNum} />
          </>
        ) : (
          <Button onClick={generateRegion} variant='outlined'>
            Select a Region
          </Button>
        )}
      </Buttons>
    </Container>
  );
};

const Buttons = styled.div`
  display: flex;
  margin-top: 20px;
`;

const Container = styled(Box)`
  margin: 20px;
`;

export default SoundWave;
