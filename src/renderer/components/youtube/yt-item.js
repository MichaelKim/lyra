// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import { formatDuration, readableViews } from '../../util';

import type { Song, Video } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +video: Video
|};

class YtItem extends React.Component<Props> {
  render() {
    const { video } = this.props;

    return (
      <div className='youtube-item'>
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
      </div>
    );
  }
}

export default YtItem;
