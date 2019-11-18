// @flow strict

import * as React from 'react';
import path from 'path';

import AudioControl from './audio';
import Controls from './controls';
import DownloadQueue from './download';
import RangeInput from './range';
import Shuffle from './shuffle';
import VolumeBar from './volume';

import { useDispatch, useSelector } from '../../hooks';
import { formatDuration } from '../../util';
import { getStreamURL } from '../../yt-util';

import '../../../css/playback.scss';

const PlaybackBar = () => {
  const [src, setSrc] = React.useState('');
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const currSong = useSelector(state => {
    const { queue } = state;
    const { curr } = queue;

    return curr != null ? state.songs[curr] ?? queue.cache[curr] : null;
  });

  const dispatch = useDispatch();
  const skipNext = () => dispatch({ type: 'SKIP_NEXT' });

  const onProgress = (time: number) => {
    setProgress(time);
    // if (
    //   this.currSong != null &&
    //   e.currentTarget.currentTime > this.currSong.duration
    // ) {
    //   this._onEnded();
    // }
  };

  const onSeek = (seek: number) => setProgress(progress => progress + seek);

  const onTogglePause = React.useCallback(() => {
    setPlaying(playing => !playing);
  }, []);

  const onEnded = () => {
    setPlaying(false);
    skipNext();
  };

  React.useEffect(() => {
    if (currSong == null) {
      return;
    }

    // Load song data
    if (currSong.source === 'YOUTUBE') {
      getStreamURL(currSong.id).then(setSrc);
    } else {
      setSrc(path.join('file://', currSong.filepath));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currSong?.id]);

  const max = currSong?.duration ?? 0;

  const currTime = formatDuration(progress);
  const maxTime = formatDuration(max);

  return (
    <div className='playback-box'>
      <AudioControl
        src={src}
        playing={playing}
        progress={progress}
        onProgress={onProgress}
        onEnd={onEnded}
      />
      <div className='playback-bar'>
        <p>{currTime}</p>
        {currSong != null ? (
          <RangeInput value={progress} max={max} onChange={setProgress} />
        ) : (
          <RangeInput value={0} max={0} />
        )}
        <p>{maxTime}</p>
      </div>
      {currSong != null && (
        <div className='playback-left'>
          <h3>{currSong.title}</h3>
          <br />
          <h5>{currSong.artist}</h5>
        </div>
      )}
      <Controls
        disabled={currSong == null}
        playing={playing}
        onTogglePause={onTogglePause}
        onSeek={onSeek}
      />
      <div className='playback-right'>
        <DownloadQueue />
        <Shuffle />
        <VolumeBar />
      </div>
    </div>
  );
};

export default PlaybackBar;
