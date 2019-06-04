// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Search from '../search';
import Loading from '../loading';
import { formatDuration, readableViews } from '../../util';
import { ytSearch } from '../../yt-util';

import type { StoreState, Dispatch, Song, Video } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +selectSong: (song: Song) => void
|};

type State = {|
  keyword: string,
  searching: boolean,
  videos: Video[]
|};

class Youtube extends React.Component<Props, State> {
  state = {
    keyword: '',
    searching: false,
    videos: []
  };

  _onSearch = (value: string) => {
    this.setState({
      keyword: value,
      searching: true
    });

    ytSearch(value).then(videos =>
      this.setState({
        searching: false,
        videos
      })
    );
  };

  _playVideo = (video: Video) => {
    console.log(video);
    this.props.selectSong({
      id: video.id,
      title: video.title,
      artist: video.channel,
      duration: video.duration,
      name: '',
      dir: 'youtube',
      playlists: [],
      date: Date.now()
    });
  };

  render() {
    return (
      <>
        <h1>YouTube</h1>
        <Search onEnter={this._onSearch} />
        {this.state.searching ? (
          <Loading />
        ) : (
          <ul className='youtube-item-box'>
            {this.state.videos.map((video: Video) => (
              <li
                key={video.id}
                className='youtube-item'
                onClick={() => this._playVideo(video)}
              >
                <div className='youtube-item-thumbnail'>
                  <img
                    src={video.thumbnail.url}
                    width={video.thumbnail.width}
                    height={video.thumbnail.height}
                  />
                </div>
                <div className='youtube-item-text'>
                  <h3>{video.title}</h3>
                  <h5>
                    {video.channel} • {formatDuration(video.duration)} •{' '}
                    {readableViews(video.views)} views
                  </h5>
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

function mapState(state: StoreState) {
  return {};
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
