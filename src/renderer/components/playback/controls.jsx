// @flow strict

import * as React from 'react';
import { useMediaShortcuts } from '../../hooks';

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
}: Props) => {
  const onForward = () => onSeek(10);
  const onReplay = () => onSeek(-10);

  // Media control shortcuts
  useMediaShortcuts({
    'play-pause': onTogglePause,
    'skip-previous': skipPrevious,
    'skip-next': skipNext
  });

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
