// @flow strict

import * as React from 'react';

import SongItem from './screen/song-item';

import { useSelector } from '../hooks';

import '../../css/screen.scss';
import '../../css/song-row.scss';

const Queue = () => {
  const currSong = useSelector(state => {
    const { curr } = state.queue;
    return curr ? state.songs[curr] ?? state.queue.cache[curr]?.song : null;
  });

  const nextSongs = useSelector(state => {
    const { next } = state.queue;
    return next.map(id => state.songs[id] ?? state.queue.cache[id]?.song);
  });

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
