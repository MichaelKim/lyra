import { useState } from 'react';
import '../../../css/youtube.scss';
import { selectPlaylist, selectSong } from '../../actions';
import { useCurrSong, useDispatchMap, useSelector } from '../../hooks';
import { AppDispatch } from '../../state/store';
import { Song, VideoSong } from '../../types';
import YtPlaying from './yt-playing';
import YtSearch from './yt-search';

const Youtube = () => {
  const [keyword, setKeyword] = useState('');

  const currSong = useCurrSong();
  const currScreen = useSelector(state => state.currScreen);

  const { selectSong, selectPlaylist } = useDispatchMap(mapDispatch);

  const playVideo = (video: VideoSong) => {
    selectSong(video);
  };

  const onSearch = (value: string) => {
    selectPlaylist('yt-search');
    setKeyword(value);
  };

  return (
    <>
      <div
        className={
          'youtube-screen ' + (currScreen === 'yt-search' ? '' : 'hidden')
        }
      >
        <YtSearch playVideo={playVideo} initialKeyword={keyword} />
      </div>
      <div
        className={
          'youtube-screen ' + (currScreen === 'yt-playing' ? '' : 'hidden')
        }
      >
        {currSong && (
          <YtPlaying
            key={currSong.id}
            currSong={currSong}
            playVideo={playVideo}
            onSearch={onSearch}
          />
        )}
      </div>
    </>
  );
};

function mapDispatch(dispatch: AppDispatch) {
  return {
    selectSong: (song: Song) => dispatch(selectSong(song)),
    selectPlaylist: (id: string) => dispatch(selectPlaylist(id))
  };
}

export default Youtube;
