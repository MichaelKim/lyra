// @flow strict

import React from 'react';
import { useMediaShortcuts, useMediaSessionHandlers } from '../../hooks';

import type { Node } from 'React';

type Props = {|
  +disabled: boolean,
  +playing: boolean,
  +skipPrevious: () => mixed,
  +skipNext: () => mixed,
  +onTogglePause: () => mixed,
  +onSeek: (amount: number) => mixed
|};

const Controls = ({
  disabled,
  playing,
  onTogglePause,
  skipPrevious,
  skipNext,
  onSeek
}: Props): Node => {
  const onForward = () => onSeek(10);
  const onReplay = () => onSeek(-10);

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

  // Keyboard shortcuts
  const keyboardShortcuts = {
    KeyK: onTogglePause,
    Space: onTogglePause,
    KeyJ: onReplay,
    ArrowLeft: onReplay,
    KeyL: onForward,
    ArrowRight: onForward,
    KeyH: skipPrevious,
    Semicolon: skipNext
  };

  React.useEffect(() => {
    const handleKeyboardShortcuts = ({ code }: KeyboardEvent) => {
      if (keyboardShortcuts[code]) {
        keyboardShortcuts[code]();
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcuts);

    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [keyboardShortcuts]);

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
