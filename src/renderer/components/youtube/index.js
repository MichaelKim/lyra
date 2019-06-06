// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Search from '../search';
import Loading from '../loading';
import YtSearch from './yt-search';
import YtPlaying from './yt-playing.js';
import { getRelatedVideos } from '../../yt-util';

import type { StoreState, Dispatch, Song, SongID, Video } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +currSong?: Song,
  +currScreen: ?string,
  +selectSong: (song: Song) => void,
  +selectPlaylist: (name: string) => void,
  +setNextSong: (song: Song) => void
|};

type State = {|
  keyword: string,
  related: Video[]
|};

class Youtube extends React.Component<Props, State> {
  state = {
    keyword: '',
    related: []
  };

  _videoToSong = (video: Video): Song => {
    return {
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
    };
  };

  _loadRelated = (id: SongID) => {
    getRelatedVideos(id).then(related => {
      this.setState({ related });
      this.props.setNextSong(this._videoToSong(related[0]));
    });
  };

  _playVideo = (video: Video) => {
    this.props.selectSong(this._videoToSong(video));
    this._loadRelated(video.id);
  };

  _onSearch = (value: string) => {
    this.props.selectPlaylist('yt-search');
    this.setState({
      keyword: value
    });
  };

  componentDidMount() {
    if (this.props.currSong && this.props.currSong.dir === 'youtube') {
      this._loadRelated(this.props.currSong.id);
    }
  }

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
        related={this.state.related}
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
      dispatch({ type: 'SELECT_PLAYLIST', name }),
    setNextSong: (song: Song) => dispatch({ type: 'SET_NEXT_SONG', song })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Youtube);

export default ConnectedComp;
