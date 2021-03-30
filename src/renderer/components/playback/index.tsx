import { Component } from 'react';
import { connect } from 'react-redux';
import '../../../css/playback.scss';
import { Dispatch, Song, StoreState } from '../../types';
import { getStreamURL } from '../../yt-util';
import AudioControl from './audio';
import Bar from './bar';
import Controls from './controls';
import DownloadQueue from './download';
import Shuffle from './shuffle';
import VolumeBar from './volume';

type Props = {
  currSong: Song | null;
  skipPrevious: () => void;
  skipNext: () => void;
  goToPlaying: (id: string | null) => void;
};

type State = {
  src: string | null;
  playing: boolean;
  progress: number;
};

class PlaybackBar extends Component<Props, State> {
  state: State = {
    src: null,
    playing: false,
    progress: 0
  };

  skipPreviousOrStart = () => {
    this.setState({
      playing: false,
      progress: 0
    });
    if (this.state.progress < 3) {
      this.props.skipPrevious();
    }
  };

  skipNext = () => {
    this.setState({
      playing: false,
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

  loadSong = async (autoplay: boolean, prevSongID?: string) => {
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
      playing: false,
      progress: 0
    });

    if (currSong.source === 'YOUTUBE') {
      const src = await getStreamURL(currSong.id);
      this.setState({
        src
      });

      if (navigator.mediaSession) {
        /* eslint-disable no-undef */
        navigator.mediaSession.metadata = new MediaMetadata({
          /* eslint-enable no-undef */
          title: currSong.title,
          artist: currSong.artist,
          artwork: [{ src: currSong.thumbnail.url }]
        });
      }
    } else {
      this.setState({ src: 'file://' + currSong.filepath });
    }

    if (autoplay) {
      this.setState({
        playing: true
      });
    }
  };

  onInfoClick = () => {
    const { currSong } = this.props;
    if (currSong == null) {
      return;
    }

    if (currSong.source === 'YOUTUBE') {
      this.props.goToPlaying('yt-playing');
    } else {
      this.props.goToPlaying(null);
    }
  };

  componentDidMount() {
    this.loadSong(false);

    if (navigator.mediaSession) {
      navigator.mediaSession.playbackState = 'paused';
    }
  }

  componentDidUpdate(prevProps: Props) {
    this.loadSong(true, prevProps.currSong?.id);

    if (navigator.mediaSession) {
      navigator.mediaSession.playbackState = this.state.playing
        ? 'playing'
        : 'paused';
    }
  }

  componentWillUnmount() {
    if (navigator.mediaSession) {
      navigator.mediaSession.playbackState = 'none';
    }
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
          onEnd={this.skipNext}
        />
        <Bar
          currSong={currSong}
          progress={progress}
          onChange={this.onProgress}
        />
        <div className='playback-controls'>
          <div className='playback-left' onClick={this.onInfoClick}>
            <div className='playback-left-expand'>
              {currSong != null && (
                <>
                  <h3>{currSong.title}</h3>
                  <br />
                  <h5>{currSong.artist}</h5>
                </>
              )}
            </div>
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
    skipNext: () => dispatch({ type: 'SKIP_NEXT' }),
    goToPlaying: (id: string | null) =>
      dispatch({ type: 'SELECT_PLAYLIST', id })
  };
};

export default connect(mapState, mapDispatch)(PlaybackBar);
