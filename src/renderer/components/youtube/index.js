// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { google } from 'googleapis';

import Search from '../search';
import Loading from '../loading';
import { escapeHTML, parseDuration } from '../../util';

import type { StoreState, Dispatch, Song } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +selectSong: (song: Song) => void
|};

type Video = {|
  +id: string,
  +title: string,
  +channel: string,
  +thumbnail: {|
    +width: number,
    +height: number,
    +url: string
  |},
  +duration: number
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

  _onSearch = async (value: string) => {
    this.setState({
      keyword: value,
      searching: true
    });

    const youtube = google.youtube({
      version: 'v3',
      auth: process.env.ELECTRON_WEBPACK_APP_YT_API
    });

    const res = await youtube.search.list({
      part: 'snippet',
      q: value,
      maxResults: 25,
      type: 'video'
    });

    const videos = res.data.items.map(item => ({
      id: item.id.videoId,
      title: escapeHTML(item.snippet.title),
      channel: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default
    }));

    const res2 = await youtube.videos.list({
      part: 'contentDetails',
      id: videos.map(v => v.id).join(',')
    });

    const durations = res2.data.items.map(item =>
      parseDuration(item.contentDetails.duration)
    );

    this.setState({
      searching: false,
      videos: videos.map((v, i) => ({
        ...v,
        duration: durations[i]
      }))
    });
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
            {this.state.videos.map(video => (
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
                  <h5>{video.channel}</h5>
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
