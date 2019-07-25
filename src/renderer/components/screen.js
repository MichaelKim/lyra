// @flow strict

import * as React from 'react';

import SongItem from './songItem';
import Search from './search';

import { getSongList } from '../util';
import { useSelector, useDispatch } from '../hooks';

import type { SortColumn } from '../types';

import '../../css/screen.scss';
import '../../css/song-row.scss';

export default function Screen() {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );
  const title = useSelector(state =>
    state.currScreen == null ||
    state.currScreen === 'settings' ||
    state.currScreen.startsWith('yt-')
      ? 'All Songs'
      : state.playlists[state.currScreen].name
  );
  const sort = useSelector(state => state.sort);

  const [search, setSearch] = React.useState('');

  const dispatch = useDispatch();
  const setSort = (column: SortColumn, direction: boolean) =>
    dispatch({ type: 'SET_SORT', column, direction });

  function onSort(column: SortColumn) {
    if (column === sort.column) {
      setSort(column, !sort.direction);
    } else {
      setSort(column, false);
    }
  }

  function onSearch(value: string) {
    setSearch(value.toUpperCase());
  }

  const columns = [
    { enum: 'TITLE', name: 'Title' },
    { enum: 'ARTIST', name: 'Artist' },
    { enum: 'DURATION', name: 'Duration' },
    { enum: 'DATE', name: 'Date Added' }
  ];

  const filtered = search
    ? songs.filter(song => song.title.toUpperCase().includes(search))
    : songs;

  return (
    <>
      <h1>{title}</h1>
      <div>
        <Search onChange={onSearch} />
      </div>
      <div className='song-row-header'>
        <div className='song-row'>
          <div />
          {columns.map(col => (
            <div
              key={col.enum}
              className='label'
              onClick={() => onSort(col.enum)}
            >
              {col.name}
              {sort.column === col.enum && (
                <div
                  className={`sort-icon-${sort.direction ? 'up' : 'down'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className='song-table'>
        {filtered.map(song => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    </>
  );
}
