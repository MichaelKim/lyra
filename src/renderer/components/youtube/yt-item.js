// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';
import { remote } from 'electron';

import { formatDuration, readableViews } from '../../util';

import type { Song, VideoSong, Dispatch } from '../../types';

import '../../../css/youtube.scss';

type PassedProps = {|
  +onClick?: () => void,
  +showOptions?: boolean,
  +video: VideoSong
|};

type Props = PassedProps & {|
  +addSong: (song: Song) => void
|};

class YtItem extends React.Component<Props> {
  _showOptions = () => {
    const menu = new remote.Menu();
    const item = new remote.MenuItem({
      label: 'Add to Library',
      click: () => {
        this.props.addSong(this.props.video);
      }
    });
    menu.append(item);
    menu.popup(remote.getCurrentWindow());
  };

  render() {
    const { video, onClick, showOptions } = this.props;

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
        {showOptions ? (
          <div>
            <button className='options-btn' onClick={this._showOptions} />
          </div>
        ) : null}
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addSong: (song: Song) => dispatch({ type: 'ADD_SONGS', songs: [song] })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  null,
  mapDispatch
)(YtItem);

export default ConnectedComp;
