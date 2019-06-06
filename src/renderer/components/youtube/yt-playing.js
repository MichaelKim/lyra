// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import Search from '../search';
import Loading from '../loading';
import YtItem from './yt-item';
import { getRelatedVideos } from '../../yt-util';

import type { Song, Video } from '../../types';

type Props = {|
  +currSong: Song,
  +playVideo: (video: Video) => void,
  +onSearch: (value: string) => void
|};

type State = {|
  loading: boolean,
  related: Video[]
|};

class YtPlaying extends React.Component<Props, State> {
  state = {
    loading: true,
    related: []
  };

  async componentDidMount() {
    const { currSong } = this.props;
    if (currSong.dir !== 'youtube') return;

    const related = await getRelatedVideos(currSong.id);

    this.setState({
      loading: false,
      related
    });
  }

  _playVideo = (video: Video) => {
    this.props.playVideo(video);
  };

  render() {
    const { currSong } = this.props;

    if (
      currSong.dir !== 'youtube' ||
      currSong.thumbnail == null ||
      currSong.views == null
    ) {
      return null;
    }

    const video: Video = {
      id: currSong.id,
      title: currSong.title,
      channel: currSong.artist,
      thumbnail: currSong.thumbnail,
      duration: currSong.duration,
      views: currSong.views
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
        {this.state.loading ? (
          <Loading />
        ) : (
          <ul className='youtube-item-list'>
            {this.state.related.map(v => (
              <li key={v.id} onClick={() => this._playVideo(v)}>
                <YtItem video={v} />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

export default YtPlaying;
