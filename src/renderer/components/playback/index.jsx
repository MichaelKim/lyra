// @flow strict

import * as React from 'react';
import path from 'path';

import AudioControl from './audio';
import Bar from './bar';
import Controls from './controls';
import DownloadQueue from './download';
import Shuffle from './shuffle';
import VolumeBar from './volume';

import { useDispatchMap, useSelector } from '../../hooks';
import { getStreamURL } from '../../yt-util';

import '../../../css/playback.scss';

const mapDispatch = dispatch => {
  return {
    skipPrevious: () => dispatch({ type: 'SKIP_PREVIOUS' }),
    skipNext: () => dispatch({ type: 'SKIP_NEXT' })
  };
};

const PlaybackBar = () => {
  const [src, setSrc] = React.useState<?string>(null);
  const [playing, setPlaying] = React.useState(true);
  const [progress, setProgress] = React.useState(0);

  const currSong = useSelector(state => {
    const { queue } = state;
    const { curr } = queue;

    return curr != null ? state.songs[curr] ?? queue.cache[curr]?.song : null;
  });

  const { skipPrevious, skipNext } = useDispatchMap(mapDispatch);
  const previousOrStart = React.useCallback(() => {
    if (progress < 3) {
      skipPrevious();
    } else {
      setProgress(0);
    }
  }, [skipPrevious, progress]);

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
      setPlaying(false);
      getStreamURL(currSong.id).then(src => {
        setSrc(src);
        setPlaying(true);
      });
    } else {
      setSrc(path.join('file://', currSong.filepath));
      setPlaying(true);
    }

    // Only load if the song ID is different
    // The song object can change (e.g. title, artist) while representing the same song
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currSong?.id]);

  return (
    <div className='playback-box'>
      <AudioControl
        src={src}
        playing={playing}
        progress={progress}
        onProgress={onProgress}
        onEnd={onEnded}
      />
      <Bar currSong={currSong} progress={progress} onChange={onProgress} />
      <div className='playback-controls'>
        <div className='playback-left'>
          {currSong != null && (
            <>
              <h3>{currSong.title}</h3>
              <br />
              <h5>{currSong.artist}</h5>
            </>
          )}
        </div>
        <Controls
          disabled={currSong == null}
          playing={playing}
          skipPrevious={previousOrStart}
          skipNext={skipNext}
          onTogglePause={onTogglePause}
          onSeek={onSeek}
        />
        <div className='playback-right'>
          <DownloadQueue />
          <Shuffle />
          <VolumeBar />
        </div>
      </div>
      {/* {currSong != null && (
        <div className='playback-left'>
          <h3>{currSong.title}</h3>
          <br />
          <h5>{currSong.artist}</h5>
        </div>
      )}
      <Controls
        disabled={currSong == null}
        playing={playing}
        skipPrevious={previousOrStart}
        skipNext={skipNext}
        onTogglePause={onTogglePause}
        onSeek={onSeek}
      />
      <div className='playback-right'>
        <DownloadQueue />
        <Shuffle />
        <VolumeBar />
      </div> */}
    </div>
  );
};

export default PlaybackBar;
