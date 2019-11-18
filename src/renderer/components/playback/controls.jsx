// @flow strict

import * as React from 'react';
import { ipcRenderer } from 'electron';

import { useDispatch } from '../../hooks';

type Props = {|
  +disabled: boolean,
  +playing: boolean,
  +onTogglePause: () => mixed,
  +onSeek: (amount: number) => mixed
|};

const Controls = (props: Props) => {
  const { disabled, playing, onTogglePause, onSeek } = props;

  const dispatch = useDispatch();
  const skipPrevious = React.useCallback(
    () => dispatch({ type: 'SKIP_PREVIOUS' }),
    [dispatch]
  );
  const skipNext = React.useCallback(() => dispatch({ type: 'SKIP_NEXT' }), [
    dispatch
  ]);

  const onForward = () => onSeek(10);
  const onReplay = () => onSeek(-10);

  // Media control shortcuts
  React.useEffect(() => {
    ipcRenderer.on('play-pause', onTogglePause);
    ipcRenderer.on('skip-previous', skipPrevious);
    ipcRenderer.on('skip-next', skipNext);

    return () => {
      ipcRenderer.removeListener('play-pause', onTogglePause);
      ipcRenderer.removeListener('skip-previous', skipPrevious);
      ipcRenderer.removeListener('skip-next', skipNext);
    };
  }, [onTogglePause, skipPrevious, skipNext]);

  return (
    <div className='playback-controls'>
      <button className='skip-previous' onClick={skipPrevious} />
      <button className='replay-btn' onClick={onReplay} />
      <button
        className={'play-pause ' + (playing ? 'pause' : 'play')}
        onClick={onTogglePause}
        disabled={disabled}
      />
      <button className='forward-btn' onClick={onForward} />
      <button className='skip-next' onClick={skipNext} />
    </div>
  );
};

export default Controls;
