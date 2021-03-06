import '../../../css/youtube.scss';
import { useDispatchMap } from '../../hooks';
import { Dispatch, Song, SongID, VideoSong } from '../../types';
import { formatDuration } from '../../util';
import ContextMenu from '../context';

type Props = {
  video: VideoSong;
  onClick?: () => void;
};

const YtItem = ({ video, onClick }: Props) => {
  const { addSong, downloadAdd } = useDispatchMap(mapDispatch);

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
      <ContextMenu
        className='context-content'
        items={[
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
        ]}
      >
        <button className='options-btn' />
      </ContextMenu>
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
