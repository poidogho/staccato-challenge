/* eslint-disable @typescript-eslint/no-explicit-any */
export const trimWave = (current: any, audioBuffer: ArrayBuffer) => {
  const region = current.getActivePlugins()[0].regions[0];
  const { numberOfChannels, sampleRate } = current.getDecodedData();
  const bitsPerSample = 16;
  const bytesPerSample = (bitsPerSample / 8) * numberOfChannels;
  const startByteIndex = Math.floor(
    region?.start * sampleRate * bytesPerSample
  );
  const endByteIndex = Math.ceil(region?.end * sampleRate * bytesPerSample);
  const firstPart = audioBuffer.slice(0, startByteIndex);
  const secondPart = audioBuffer.slice(endByteIndex);
  const newBuffer = new ArrayBuffer(
    firstPart.byteLength + secondPart.byteLength
  );
  const firstPartView = new Uint8Array(firstPart);
  const secondPartView = new Uint8Array(secondPart);
  new Uint8Array(newBuffer).set(firstPartView);
  new Uint8Array(newBuffer).set(secondPartView, firstPartView.length);

  const audioBlob = new Blob([newBuffer], { type: 'audio/wav' });
  const blobUrl = URL.createObjectURL(audioBlob);
  current.load(blobUrl);
};
