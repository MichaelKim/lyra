import '../../css/screen.scss';
import '../../css/song-row.scss';
import { useCurrSong, useSelector } from '../hooks';
import { Song } from '../types';
import SongItem from './screen/song-item';

const columns = [
  { enum: 'TITLE', name: 'Title' },
  { enum: 'ARTIST', name: 'Artist' },
  { enum: 'DURATION', name: 'Duration' },
  { enum: 'DATE', name: 'Date Added' }
];

const renderHeader = (
  <div className='song-row-header'>
    <div className='song-row'>
      <div />
      {columns.map(col => (
        <div key={col.enum} className='label'>
          {col.name}
        </div>
      ))}
    </div>
  </div>
);

const Queue = () => {
  const currSong = useCurrSong();
  const nextSongs = useSelector<Array<Song>>(state => {
    const { next } = state.queue;
    return next.map(id => state.songs[id] ?? state.queue.cache[id]?.song);
  });

  return (
    <>
      <h1>Queue</h1>
      <h2>Now Playing</h2>
      {renderHeader}
      <div className='song-table'>
        {currSong && <SongItem key={currSong.id} song={currSong} />}
      </div>
      <h2>Next Up</h2>
      {renderHeader}
      <div className='song-table'>
        {nextSongs.map(song => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    </>
  );
};

export default Queue;
