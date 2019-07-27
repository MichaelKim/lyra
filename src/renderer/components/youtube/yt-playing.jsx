// @flow strict

import * as React from 'react';

import Search from '../search';
import Loading from '../loading';
import YtItem from './yt-item';

import type { Song, VideoSong } from '../../types';

type Props = {|
  +currSong: Song,
  +related: VideoSong[],
  +playVideo: (video: VideoSong) => void,
  +onSearch: (value: string) => void
|};

class YtPlaying extends React.Component<Props> {
  _playVideo = (video: VideoSong) => {
    this.props.playVideo(video);
  };

  render() {
    const { currSong } = this.props;

    if (currSong.source !== 'YOUTUBE') {
      return null;
    }

    const video: VideoSong = {
      id: currSong.id,
      title: currSong.title,
      artist: currSong.artist,
      duration: currSong.duration,
      playlists: [],
      date: Date.now(),
      source: 'YOUTUBE',
      url: currSong.id,
      views: currSong.views,
      thumbnail: currSong.thumbnail
    };

    return (
      <>
        <div className='yt-playing-header'>
          <h1>YouTube</h1>
          <div>
            <Search onEnter={this.props.onSearch} />
          </div>
        </div>
        <div className='yt-playing-current'>
          <h3 className='yt-playing-heading'>Currently Playing:</h3>
          <YtItem video={video} />
        </div>
        <h3 className='yt-playing-heading'>Related Videos:</h3>
        {this.props.related.length === 0 ? (
          <Loading />
        ) : (
          <ul className='youtube-item-list'>
            {this.props.related.map(v => (
              <li key={v.id}>
                <YtItem video={v} onClick={() => this._playVideo(v)} />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

export default YtPlaying;
