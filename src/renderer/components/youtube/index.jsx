// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import YtSearch from './yt-search';
import YtPlaying from './yt-playing';
import { getRelatedVideos } from '../../yt-util';

import type {
  StoreState,
  Dispatch,
  Song,
  SongID,
  VideoSong
} from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +currSong: ?Song,
  +currScreen: ?string,
  +selectSong: (song: Song) => void,
  +selectPlaylist: (id: string) => void
|};

type State = {|
  keyword: string,
  related: VideoSong[]
|};

class Youtube extends React.Component<Props, State> {
  mounted = false;
  state = {
    keyword: '',
    related: []
  };

  _loadRelated = (id: SongID) => {
    getRelatedVideos(id).then(related => {
      if (this.mounted) {
        this.setState({ related });
      }
    });
  };

  _playVideo = (video: VideoSong) => {
    this.props.selectSong(video);
    this._loadRelated(video.id);
  };

  _onSearch = (value: string) => {
    this.props.selectPlaylist('yt-search');
    this.setState({
      keyword: value
    });
  };

  componentDidMount() {
    this.mounted = true;
    if (this.props.currSong && this.props.currSong.source === 'YOUTUBE') {
      this._loadRelated(this.props.currSong.id);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
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
  const { queue } = state;
  const { curr } = queue;

  return {
    currSong: curr != null ? state.songs[curr] ?? queue.cache[curr] : null,
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
