// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import Search from '../search';
import Loading from '../loading';
import YtItem from './yt-item';
import { ytSearch } from '../../yt-util';

import type { Song, Video } from '../../types';

type Props = {|
  +playVideo: (video: Video) => void,
  +initialKeyword?: string
|};

type State = {|
  searching: boolean,
  videos: Video[]
|};

class YtSearch extends React.Component<Props, State> {
  state = {
    searching: false,
    videos: []
  };

  _onSearch = (value: string) => {
    this.setState({
      searching: true
    });

    ytSearch(value).then(videos =>
      this.setState({
        searching: false,
        videos
      })
    );
  };

  componentDidMount() {
    if (this.props.initialKeyword) {
      this._onSearch(this.props.initialKeyword);
    }
  }

  render() {
    return (
      <>
        <h1>YouTube</h1>
        <Search
          onEnter={this._onSearch}
          initialValue={this.props.initialKeyword || ''}
        />
        {this.state.searching ? (
          <Loading />
        ) : (
          <ul className='youtube-item-list'>
            {this.state.videos.map((video: Video) => (
              <li key={video.id} onClick={() => this.props.playVideo(video)}>
                <YtItem video={video} />
              </li>
            ))}
          </ul>
        )}
      </>
    );
  }
}

export default YtSearch;
