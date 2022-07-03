import { useState } from 'react';
import '../../../css/screen.scss';
import '../../../css/song-row.scss';
import { setSort } from '../../actions';
import { useDispatch, useSelector } from '../../hooks';
import { SortColumn } from '../../types';
import { getSongList } from '../../util';
import Search from '../search';
import SongItem from './song-item';

const COLUMNS = [
  { enum: SortColumn.TITLE, name: 'Title' },
  { enum: SortColumn.ARTIST, name: 'Artist' },
  { enum: SortColumn.DURATION, name: 'Duration' },
  { enum: SortColumn.DATE, name: 'Date Added' }
] as const;

export default function Screen() {
  const songs = useSelector(state =>
    getSongList(state.songs, state.currScreen, state.sort)
  );
  const title = useSelector(state =>
    state.currScreen == null || state.playlists[state.currScreen] == null
      ? 'All Songs'
      : state.playlists[state.currScreen].name
  );
  const sort = useSelector(state => state.sort);

  const [search, setSearch] = useState('');

  const dispatch = useDispatch();
  const _setSort = (column: SortColumn, direction: boolean) =>
    dispatch(setSort({ column, direction }));

  function onSort(column: SortColumn) {
    if (column === sort.column) {
      _setSort(column, !sort.direction);
    } else {
      _setSort(column, false);
    }
  }

  function onSearch(value: string) {
    setSearch(value.toUpperCase());
  }

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
          {COLUMNS.map(col => (
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
