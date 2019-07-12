// @flow strict

import * as React from 'react';

import { values } from '../util';
import { useSelector, useDispatch } from '../hooks';

import type { Playlist, PlaylistID } from '../types';

import '../../css/sidebar.scss';

export default function Sidebar() {
  const currScreen = useSelector(state => state.currScreen);
  const playlists = useSelector(state => values(state.playlists));

  const [editing, setEditing] = React.useState(false);
  const [value, setValue] = React.useState('');

  const dispatch = useDispatch();
  const createPlaylist = (playlist: Playlist) =>
    dispatch({ type: 'CREATE_PLAYLIST', playlist });
  const selectPlaylist = (id: ?string) =>
    dispatch({ type: 'SELECT_PLAYLIST', id });
  const deletePlaylist = (id: PlaylistID) =>
    dispatch({ type: 'DELETE_PLAYLIST', id });

  function renderItem(
    key: ?string,
    name: string,
    selected: boolean,
    deletable: boolean = false
  ) {
    return (
      <div
        key={key}
        className={
          'sidebar-link sidebar-section ' +
          (selected ? ' sidebar-selected' : '') +
          (deletable ? ' sidebar-del' : '')
        }
      >
        <p onClick={() => selectPlaylist(key)}>{name}</p>
        <button
          className='del-btn'
          onClick={() => key && deletePlaylist(key)}
        />
      </div>
    );
  }

  function addPlaylist() {
    setEditing(true);
    setValue('');
  }

  function finishEdit() {
    setEditing(false);

    // Don't create if empty name
    if (value) {
      createPlaylist({
        id: Date.now().toString(),
        name: value,
        songs: []
      });
    }
  }

  function onChange(e: SyntheticInputEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function onKeyDown(e: SyntheticKeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      finishEdit();
    }
  }

  function onBlur() {
    // Don't create if clicking elsewhere
    setEditing(false);
  }

  const items = [
    { name: 'All Songs', enum: null },
    { name: 'Settings', enum: 'settings' }
  ];

  return (
    <div className='sidebar'>
      <h3 className='sidebar-title'>Lyra Player</h3>

      <div className='sidebar-section'>
        <p className='label'>Library</p>
      </div>
      {items.map(item =>
        renderItem(item.enum, item.name, currScreen == item.enum)
      )}

      <div className='sidebar-section'>
        <p className='label'>YouTube</p>
      </div>
      {renderItem('yt-search', 'Search', currScreen === 'yt-search')}
      {renderItem('yt-playing', 'Playing', currScreen === 'yt-playing')}

      <div className='sidebar-section'>
        <p className='label'>Playlists</p>
        <button className='add-btn' onClick={addPlaylist} />
      </div>
      {editing && (
        <input
          autoFocus
          type='text'
          placeholder='Playlist Name'
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      )}
      {playlists.map(playlist =>
        renderItem(
          playlist.id,
          playlist.name,
          currScreen === playlist.name,
          true
        )
      )}
    </div>
  );
}
