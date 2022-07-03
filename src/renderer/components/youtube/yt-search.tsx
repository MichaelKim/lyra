import { useEffect, useState } from 'react';
import { selectPlaylist } from '../../actions';
import { useDispatch } from '../../hooks';
import { VideoSong } from '../../types';
import { ytSearch } from '../../yt-util';
import Loading from '../loading';
import YtSuggest from './search-suggest';
import YtItem from './yt-item';

type Props = {
  playVideo: (video: VideoSong) => void;
  initialKeyword?: string;
};

export default function YtSearch(props: Props) {
  const [searching, setSearching] = useState(false);
  const [videos, setVideos] = useState<VideoSong[]>([]);

  const dispatch = useDispatch();
  const showYtPlaying = () => dispatch(selectPlaylist('yt-playing'));

  const onSearch = async (value: string) => {
    setSearching(true);

    const videos = await ytSearch(value);
    setSearching(false);
    setVideos(videos);
  };

  const onClick = (video: VideoSong) => {
    showYtPlaying();
    props.playVideo(video);
  };

  useEffect(() => {
    if (props.initialKeyword) {
      onSearch(props.initialKeyword);
    }
  }, [props.initialKeyword]);

  return (
    <>
      <h1>YouTube</h1>
      <YtSuggest
        key={props.initialKeyword}
        onSearch={onSearch}
        initialValue={props.initialKeyword || ''}
      />
      {searching ? (
        <Loading />
      ) : (
        <ul className='youtube-item-list'>
          {videos.map((video: VideoSong) => (
            <li key={video.id} onClick={() => onClick(video)}>
              <YtItem video={video} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
