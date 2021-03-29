// @flow strict

import React from 'react';
import YtSuggest from './search-suggest';
import Loading from '../loading';
import YtItem from './yt-item';
import { getRelatedVideos } from '../../yt-util';

import type { Node } from 'React';
import type { Song, SongID, VideoSong } from '../../types';

type Props = {|
  +currSong: Song,
  +playVideo: (video: VideoSong) => mixed,
  +onSearch: (value: string) => mixed
|};

type State = {|
  related: VideoSong[]
|};

class YtPlaying extends React.Component<Props, State> {
  mounted: boolean = false;
  state: State = {
    related: []
  };

  _playVideo: (video: VideoSong) => void = (video: VideoSong) => {
    this.props.playVideo(video);
  };

  _loadRelated: (id: SongID) => void = (id: SongID) => {
    getRelatedVideos(id).then(related => {
      if (this.mounted) {
        this.setState({ related });
      }
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

  render(): null | Node {
    const { currSong } = this.props;

    if (currSong.source !== 'YOUTUBE') {
      return null;
    }

    return (
      <>
        <div className='yt-playing-header'>
          <h1>YouTube</h1>
          <div>
            <YtSuggest onSearch={this.props.onSearch} />
          </div>
        </div>
        <div className='yt-playing-current'>
          <h3 className='yt-playing-heading'>Currently Playing:</h3>
          <YtItem video={currSong} />
        </div>
        <h3 className='yt-playing-heading'>Related Videos:</h3>
        {this.state.related.length === 0 ? (
          <Loading />
        ) : (
          <ul className='youtube-item-list'>
            {this.state.related.map(v => (
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
