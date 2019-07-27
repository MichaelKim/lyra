// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import { formatDuration, readableViews, showContextMenu } from '../../util';

import type { Song, SongID, VideoSong, Dispatch } from '../../types';

import '../../../css/youtube.scss';

type PassedProps = {|
  +onClick?: () => void,
  +video: VideoSong
|};

type Props = PassedProps & {|
  +addSong: (song: Song) => void,
  +downloadAdd: (id: SongID) => void
|};

class YtItem extends React.Component<Props> {
  _showOptions = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    showContextMenu([
      {
        label: 'Add to Library',
        click: () => {
          this.props.addSong(this.props.video);
        }
      },
      {
        label: 'Download Audio',
        click: () => {
          this.props.downloadAdd(this.props.video.id);
        }
      }
    ]);
  };

  render() {
    const { video, onClick } = this.props;

    return (
      <div className='youtube-item'>
        <div className='youtube-item-thumbnail' onClick={onClick}>
          <img src={video.thumbnail.url} />
        </div>
        <div className='youtube-item-text' onClick={onClick}>
          <h3>{video.title}</h3>
          <h5>
            {video.artist} • {formatDuration(video.duration)} •{' '}
            {readableViews(video.views)} views
          </h5>
        </div>
        <div>
          <button className='options-btn' onClick={this._showOptions} />
        </div>
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addSong: (song: Song) => dispatch({ type: 'ADD_SONGS', songs: [song] }),
    downloadAdd: (id: SongID) => dispatch({ type: 'DOWNLOAD_ADD', id })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  null,
  mapDispatch
)(YtItem);

export default ConnectedComp;
