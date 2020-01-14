// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';
import path from 'path';

import AudioControl from './audio';
import Bar from './bar';
import Controls from './controls';
import DownloadQueue from './download';
import Shuffle from './shuffle';
import VolumeBar from './volume';

import { getStreamURL } from '../../yt-util';

import type { Song, StoreState, Dispatch } from '../../types';

import '../../../css/playback.scss';

type Props = {|
  +currSong: ?Song,
  +skipPrevious: () => void,
  +skipNext: () => void
|};

type State = {|
  src: ?string,
  playing: boolean,
  progress: number
|};

class PlaybackBar extends React.Component<Props, State> {
  state = {
    src: null,
    playing: false,
    progress: 0
  };

  skipPreviousOrStart = () => {
    this.setState({
      progress: 0
    });
    if (this.state.progress < 3) {
      this.props.skipPrevious();
    }
  };

  skipNext = () => {
    this.setState({
      progress: 0
    });
    this.props.skipNext();
  };

  onProgress = (time: number) => {
    this.setState({
      progress: time
    });
  };

  onSeek = (seek: number) => {
    this.setState(({ progress }) => ({
      progress: progress + seek
    }));
  };

  onTogglePause = () => {
    this.setState(({ playing }) => ({
      playing: !playing
    }));
  };

  onEnded = () => {
    this.setState({
      playing: false
    });
    this.props.skipNext();
  };

  loadSong = async (autoplay: boolean, prevSongID: ?string) => {
    const { currSong } = this.props;
    if (currSong == null) {
      if (prevSongID != null) {
        // currSong turned null, stop playing
        this.setState({
          playing: false,
          src: null,
          progress: 0
        });
      }
      return;
    }

    if (prevSongID === currSong.id) {
      return;
    }

    this.setState({
      playing: false
    });

    if (currSong.source === 'YOUTUBE') {
      const src = await getStreamURL(currSong.id);
      this.setState({
        src
      });

      if ('mediaSession' in navigator) {
        /* eslint-disable no-undef */
        navigator.mediaSession.metadata = new MediaMetadata({
          /* eslint-enable no-undef */
          title: currSong.title,
          artist: currSong.artist,
          artwork: [{ src: currSong.thumbnail.url }]
        });
      }
    } else {
      this.setState({ src: path.join('file://', currSong.filepath) });
    }

    if (autoplay) {
      this.setState({
        playing: true
      });
    }
  };

  componentDidMount() {
    this.loadSong(false);
    navigator.mediaSession.playbackState = 'paused';
  }

  componentDidUpdate(prevProps) {
    this.loadSong(true, prevProps.currSong?.id);

    navigator.mediaSession.playbackState = this.state.playing
      ? 'playing'
      : 'paused';
  }

  componentWillUnmount() {
    navigator.mediaSession.playbackState = 'none';
  }

  render() {
    const { currSong } = this.props;
    const { src, playing, progress } = this.state;

    return (
      <div className='playback-box'>
        <AudioControl
          src={src}
          playing={playing}
          progress={progress}
          onProgress={this.onProgress}
          onEnd={this.onEnded}
        />
        <Bar
          currSong={currSong}
          progress={progress}
          onChange={this.onProgress}
        />
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
            skipPrevious={this.skipPreviousOrStart}
            skipNext={this.skipNext}
            onTogglePause={this.onTogglePause}
            onSeek={this.onSeek}
          />
          <div className='playback-right'>
            <DownloadQueue />
            <Shuffle />
            <VolumeBar />
          </div>
        </div>
      </div>
    );
  }
}

const mapState = (state: StoreState) => {
  const { queue } = state;
  const { curr } = queue;

  return {
    currSong: curr != null ? state.songs[curr] ?? queue.cache[curr]?.song : null
  };
};

const mapDispatch = (dispatch: Dispatch) => {
  return {
    skipPrevious: () => dispatch({ type: 'SKIP_PREVIOUS' }),
    skipNext: () => dispatch({ type: 'SKIP_NEXT' })
  };
};

export default (connect(
  mapState,
  mapDispatch
)(PlaybackBar): React.ComponentType<{||}>);
