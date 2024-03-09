import { trimWave } from './soundwave';

global.URL.createObjectURL = jest.fn();

describe('trimWave', () => {
  it('trims an audio buffer based on the region and creates a Blob URL', () => {
    const sampleRate = 44100;
    const numberOfChannels = 2;
    const regionStart = 1;
    const regionEnd = 2;
    const audioBufferLength = sampleRate * 2 * 2;
    const audioBuffer = new ArrayBuffer(audioBufferLength);

    const current = {
      getActivePlugins: jest
        .fn()
        .mockReturnValue([
          { regions: [{ start: regionStart, end: regionEnd }] },
        ]),
      getDecodedData: jest
        .fn()
        .mockReturnValue({ numberOfChannels, sampleRate }),
      load: jest.fn(),
    };

    trimWave(current, audioBuffer);

    expect(current.load).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();

    const blobArg = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blobArg).toBeInstanceOf(Blob);
    expect(blobArg.size).toBeLessThan(audioBufferLength);
    expect(blobArg.type).toEqual('audio/wav');
  });
});
