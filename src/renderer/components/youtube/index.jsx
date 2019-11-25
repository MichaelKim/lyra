// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import YtSearch from './yt-search';
import YtPlaying from './yt-playing';

import type { StoreState, Dispatch, Song, VideoSong } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +currSong: ?Song,
  +currScreen: ?string,
  +selectSong: (song: Song) => void,
  +selectPlaylist: (id: string) => void
|};

type State = {|
  keyword: string
|};

class Youtube extends React.Component<Props, State> {
  mounted = false;
  state = {
    keyword: ''
  };

  _playVideo = (video: VideoSong) => {
    this.props.selectSong(video);
  };

  _onSearch = (value: string) => {
    this.props.selectPlaylist('yt-search');
    this.setState({
      keyword: value
    });
  };

  render() {
    const { currSong, currScreen } = this.props;

    return (
      <>
        <div
          className={
            'youtube-screen ' + (currScreen === 'yt-search' ? '' : 'hidden')
          }
        >
          <YtSearch
            playVideo={this._playVideo}
            initialKeyword={this.state.keyword}
          />
        </div>
        <div
          className={
            'youtube-screen ' + (currScreen === 'yt-playing' ? '' : 'hidden')
          }
        >
          {currSong && (
            <YtPlaying
              key={currSong.id}
              currSong={currSong}
              playVideo={this._playVideo}
              onSearch={this._onSearch}
            />
          )}
        </div>
      </>
    );
  }
}

function mapState(state: StoreState) {
  const { queue } = state;
  const { curr } = queue;

  return {
    currSong:
      curr != null ? state.songs[curr] ?? queue.cache[curr]?.song : null,
    currScreen: state.currScreen
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song }),
    selectPlaylist: (id: string) => dispatch({ type: 'SELECT_PLAYLIST', id })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Youtube);

export default ConnectedComp;
