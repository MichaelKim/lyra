// @flow strict

import React from 'react';
import YtSuggest from './search-suggest';
import Loading from '../loading';
import YtItem from './yt-item';
import { ytSearch } from '../../yt-util';
import { useDispatch } from '../../hooks';

import type { Node } from 'React';
import type { VideoSong } from '../../types';

type Props = {|
  +playVideo: (video: VideoSong) => mixed,
  +initialKeyword?: string
|};

export default function YtSearch(props: Props): Node {
  const [searching, setSearching] = React.useState(false);
  const [videos, setVideos] = React.useState<VideoSong[]>([]);

  const dispatch = useDispatch();
  const showYtPlaying = () =>
    dispatch({ type: 'SELECT_PLAYLIST', id: 'yt-playing' });

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

  React.useEffect(() => {
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
