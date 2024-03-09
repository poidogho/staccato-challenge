import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-audio-url');

describe('App Component', () => {
  it('uploads an audio file and displays SoundWave', async () => {
    render(<App />);

    const mockFileReader = {
      readAsArrayBuffer: jest.fn(),
      onload: jest.fn(),
      result: new ArrayBuffer(10),
    };
    //@ts-expect-error attaching function to window object
    window.FileReader = jest.fn(() => mockFileReader);

    const file = new File(['audio'], 'audio.mp3', { type: 'audio/mp3' });
    const fileInput = screen.getByLabelText(/upload/i);
    fireEvent.change(fileInput, { target: { files: [file] } });

    mockFileReader.onload({ target: mockFileReader });

    expect(mockFileReader.readAsArrayBuffer).toHaveBeenCalledWith(file);
    expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
    expect(screen.getByText(/Staccato AI Wave Challenge/)).toBeInTheDocument();

    expect(
      await screen.findByText(/SoundWave component content or identifier/)
    ).toBeInTheDocument();
  });
});
