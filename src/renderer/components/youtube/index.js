// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Search from '../search';
import Loading from '../loading';
import YtSearch from './yt-search';
import YtPlaying from './yt-playing.js';

import type { StoreState, Dispatch, Song, Video } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +currSong?: Song,
  +currScreen: ?string,
  +selectSong: (song: Song) => void,
  +selectPlaylist: (name: string) => void
|};

type State = {|
  keyword: string
|};

class Youtube extends React.Component<Props, State> {
  state = {
    keyword: ''
  };

  _playVideo = (video: Video) => {
    this.props.selectSong({
      id: video.id,
      title: video.title,
      artist: video.channel,
      duration: video.duration,
      name: '',
      dir: 'youtube',
      playlists: [],
      date: Date.now(),
      thumbnail: video.thumbnail,
      views: video.views
    });
  };

  _onSearch = (value: string) => {
    this.props.selectPlaylist('yt-search');
    this.setState({
      keyword: value
    });
  };

  render() {
    const { currSong, currScreen } = this.props;

    if (currScreen !== 'yt-search' && currScreen !== 'yt-playing') {
      return null;
    }

    if (currScreen === 'yt-search') {
      return (
        <YtSearch
          playVideo={this._playVideo}
          initialKeyword={this.state.keyword}
        />
      );
    }

    if (currSong == null) {
      return null;
    }

    return (
      <YtPlaying
        key={currSong.id}
        currSong={currSong}
        playVideo={this._playVideo}
        onSearch={this._onSearch}
      />
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSong: state.currSong,
    currScreen: state.currScreen
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song }),
    selectPlaylist: (name: string) =>
      dispatch({ type: 'SELECT_PLAYLIST', name })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Youtube);

export default ConnectedComp;
