import { useCallback, useEffect } from 'react';
import { useMediaSessionHandlers, useMediaShortcuts } from '../../hooks';

type Props = {
  disabled: boolean;
  playing: boolean;
  skipPrevious: () => void;
  skipNext: () => void;
  onTogglePause: () => void;
  onSeek: (amount: number) => void;
};

const Controls = ({
  disabled,
  playing,
  onTogglePause,
  skipPrevious,
  skipNext,
  onSeek
}: Props) => {
  const onForward = useCallback(() => onSeek(10), [onSeek]);
  const onReplay = useCallback(() => onSeek(-10), [onSeek]);

  // Media control shortcuts
  useMediaShortcuts({
    'play-pause': onTogglePause,
    'skip-previous': skipPrevious,
    'skip-next': skipNext
  });

  // Media Session API handlers
  useMediaSessionHandlers({
    seekbackward: onReplay,
    seekforward: onForward,
    play: onTogglePause,
    pause: onTogglePause,
    previoustrack: skipPrevious,
    nexttrack: skipNext
    // Doesn't work on Electron (and Chrome seems broken anyways)
    // seekto: (e: { seekTime: number }) => onSeek(e.seekTime)
  });

  useEffect(() => {
    const handleKeyboardShortcuts = ({ code }: KeyboardEvent) => {
      // Keyboard shortcuts
      switch (code) {
        case 'KeyK':
          onTogglePause();
          break;
        case 'Space':
          onTogglePause();
          break;
        case 'KeyJ':
          onReplay();
          break;
        case 'ArrowLeft':
          onReplay();
          break;
        case 'KeyL':
          onForward();
          break;
        case 'ArrowRight':
          onForward();
          break;
        case 'KeyH':
          skipPrevious();
          break;
        case 'Semicolon':
          skipNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [onTogglePause, onReplay, onForward, skipPrevious, skipNext]);

  return (
    <div className='playback-center'>
      <button className='skip-previous' onClick={skipPrevious} />
      <button className='replay-btn' onClick={onReplay} />
      <button
        className={'play-pause ' + (disabled || !playing ? 'play' : 'pause')}
        onClick={onTogglePause}
        disabled={disabled}
      />
      <button className='forward-btn' onClick={onForward} />
      <button className='skip-next' onClick={skipNext} />
    </div>
  );
};

export default Controls;
