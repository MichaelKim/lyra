// @flow strict

import * as React from 'react';
import path from 'path';
import { ipcRenderer } from 'electron';
// import fs from 'fs';
// import ReactPlayer from 'react-player';

import AudioControl from './audio';
import RangeInput from './range';
import VolumeBar from './volume';

import { useSelector, useDispatch } from '../../hooks';
import { formatDuration } from '../../util';
import { getStreamURL } from '../../yt-util';

import '../../../css/playback.scss';

const PlaybackBar = () => {
  const [src, setSrc] = React.useState('');
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);
  const [showDlQueue, setShowDlQueue] = React.useState(false);

  const currSong = useSelector(state => {
    const { queue } = state;
    const { curr } = queue;

    return curr != null ? state.songs[curr] ?? queue.cache[curr] : null;
  });

  const shuffle = useSelector(state => state.shuffle);
  const dlQueue = useSelector(state => state.dlQueue);
  const dlProgress = useSelector(state => (0 | (state.dlProgress * 100)) / 100);

  const dispatch = useDispatch();
  const skipPrevious = React.useCallback(
    () => dispatch({ type: 'SKIP_PREVIOUS' }),
    [dispatch]
  );
  const skipNext = React.useCallback(() => dispatch({ type: 'SKIP_NEXT' }), [
    dispatch
  ]);
  const setShuffle = (shuffle: boolean) =>
    dispatch({ type: 'SET_SHUFFLE', shuffle });

  const onProgress = (time: number) => {
    setProgress(time);
    // if (
    //   this.currSong != null &&
    //   e.currentTarget.currentTime > this.currSong.duration
    // ) {
    //   this._onEnded();
    // }
  };

  const onSeek = (seek: number) => {
    setProgress(seek);
  };

  const onReplay = () => {
    // Don't need to max 0
    onSeek(progress - 10);
  };

  const onForward = () => {
    // Don't need to min duration
    onSeek(progress + 10);
  };

  const onTogglePause = React.useCallback(() => {
    setPlaying(!playing);
  }, [playing]);

  const onEnded = () => {
    setPlaying(false);

    skipNext();
  };

  const onShuffle = () => {
    setShuffle(!shuffle);
  };

  const onShowDlQueue = () => {
    setShowDlQueue(!showDlQueue);
  };

  // Media control shortcuts
  React.useEffect(() => {
    ipcRenderer.on('play-pause', () => {
      onTogglePause();
    });

    ipcRenderer.on('skip-previous', () => {
      skipPrevious();
    });

    ipcRenderer.on('skip-next', () => {
      skipNext();
    });
  }, [onTogglePause, skipPrevious, skipNext]);

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
          <RangeInput value={progress} max={max} onChange={onSeek} />
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
      <div className='playback-controls'>
        <button className='skip-previous' onClick={skipPrevious} />
        <button className='replay-btn' onClick={onReplay} />
        <button
          className={'play-pause ' + (playing ? 'pause' : 'play')}
          onClick={onTogglePause}
          disabled={currSong == null}
        />
        <button className='forward-btn' onClick={onForward} />
        <button className='skip-next' onClick={skipNext} />
      </div>
      <div className='playback-right'>
        <div className='dl-box'>
          {dlQueue.length > 0 && (
            <>
              <button className='download-btn' onClick={onShowDlQueue} />
              {showDlQueue && (
                <div className='dl-popover'>
                  <h3>Download Queue</h3>
                  <div>{dlProgress}%</div>
                  {dlQueue.map(id => (
                    <div key={id}>{id}</div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <button
          className={'shuffle-btn ' + (shuffle ? '' : 'shuffle-off')}
          onClick={onShuffle}
        />
        <VolumeBar />
      </div>
    </div>
  );
};

export default PlaybackBar;

//   <ReactPlayer
//     // url={'file:///C:/Users/Michael/Music/' + this.state.playing}
//     url={'https://www.youtube.com/watch?v=ikU7C8TMiiw'}
//     // url={
//     //   'file:///C:/Users/Michael/Documents/Github/music-player/video.mp4'
//     // }
//     controls
//     playing
//   />
// ) : null}
// {/* <iframe
//   type="text/html"
//   width="640"
//   height="360"
//   src="https://www.youtube.com/embed/ikU7C8TMiiw?autoplay=1&origin=localhost"
//   frameBorder="0"
// /> */}
// {/* <audio
//   controls
//   src={'file:///C:/Users/Michael/Music/' + this.state.music[0]}
// /> */}
// {/* <video
//   src="file:///C:/Users/Michael/Documents/Github/music-player/video.mp4"
//   controls
// /> */}
