// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Search from '../search';
import Loading from '../loading';
import YtSearch from './yt-search';
import YtPlaying from './playing.js';

import type { StoreState, Dispatch, Song, Video } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +currSong: Song,
  +selectSong: (song: Song) => void
|};

type State = {|
  loading: boolean,
  videos: Video[]
|};

class Youtube extends React.Component<Props, State> {
  state = {
    loading: false,
    videos: []
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

  render() {
    return (
      <YtPlaying currSong={this.props.currSong} playVideo={this._playVideo} />
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSong: state.currSong
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Youtube);

export default ConnectedComp;
