import { useState } from 'react';
import '../../css/sidebar.scss';
import { createPlaylist, deletePlaylist, selectPlaylist } from '../actions';
import { useDispatch, useSelector, useToggle } from '../hooks';

export default function Sidebar() {
  const [openSidebar, toggleSidebar] = useToggle(false);
  const currScreen = useSelector(state => state.currScreen);
  const playlists = useSelector(state => Object.values(state.playlists));

  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState('');

  const dispatch = useDispatch();

  function renderItem(
    key: string | null,
    name: string,
    selected: boolean,
    deletable = false
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
        <p onClick={() => dispatch(selectPlaylist(key)) && toggleSidebar()}>
          {name}
        </p>
        <button
          className='del-btn'
          onClick={() => key && dispatch(deletePlaylist(key))}
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
      dispatch(
        createPlaylist({
          id: Date.now().toString(),
          name: value,
          songs: []
        })
      );
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    e.stopPropagation();
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
    { name: 'Queue', enum: 'queue' },
    { name: 'Settings', enum: 'settings' }
  ];

  return (
    <>
      <button className='sidebar-icon' onClick={toggleSidebar} />
      <div className={'sidebar ' + (openSidebar ? 'sidebar-open' : '')}>
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
        <div className='sidebar-playlists'>
          {playlists.map(playlist =>
            renderItem(
              playlist.id,
              playlist.name,
              currScreen === playlist.name,
              true
            )
          )}
        </div>
      </div>
      <div
        className={
          'sidebar-close ' + (openSidebar ? 'sidebar-close-active' : '')
        }
        onClick={toggleSidebar}
      />
    </>
  );
}
