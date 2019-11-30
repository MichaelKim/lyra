// @flow strict

import * as React from 'react';

import { formatDuration, showContextMenu } from '../../util';
import { useDispatchMap } from '../../hooks';

import type { Song, SongID, VideoSong, Dispatch } from '../../types';

import '../../../css/youtube.scss';

type Props = {|
  +onClick?: () => void,
  +video: VideoSong
|};

const YtItem = (props: Props) => {
  const { addSong, downloadAdd } = useDispatchMap(mapDispatch);

  const { video, onClick } = props;

  const showOptions = (e: SyntheticMouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    showContextMenu([
      {
        label: 'Add to Library',
        click: () => {
          addSong(video);
        }
      },
      {
        label: 'Download Audio',
        click: () => {
          downloadAdd(video.id);
        }
      }
    ]);
  };

  return (
    <div className='youtube-item'>
      <div className='youtube-item-thumbnail' onClick={onClick}>
        <img src={video.thumbnail.url} />
      </div>
      <div className='youtube-item-text' onClick={onClick}>
        <h3>{video.title}</h3>
        <h5>
          {video.artist} • {formatDuration(video.duration)}
          {video.views && ` • ${video.views} views`}
        </h5>
      </div>
      <div>
        <button className='options-btn' onClick={showOptions} />
      </div>
    </div>
  );
};

function mapDispatch(dispatch: Dispatch) {
  return {
    addSong: (song: Song) => dispatch({ type: 'ADD_SONGS', songs: [song] }),
    downloadAdd: (id: SongID) => dispatch({ type: 'DOWNLOAD_ADD', id })
  };
}

export default YtItem;
