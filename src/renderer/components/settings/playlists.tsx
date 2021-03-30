import { useState } from 'react';
import { useDispatch, useSelector } from '../../hooks';
import { Playlist, PlaylistID } from '../../types';

export default function Playlists() {
  const playlists = useSelector(state => Object.values(state.playlists));

  const dispatch = useDispatch();
  const addPlaylist = (playlist: Playlist) =>
    dispatch({ type: 'CREATE_PLAYLIST', playlist });
  const deletePlaylist = (id: PlaylistID) =>
    dispatch({ type: 'DELETE_PLAYLIST', id });

  const [input, setInput] = useState('');

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  function onAdd() {
    addPlaylist({
      id: Date.now().toString(),
      name: input || 'Unnamed Playlist',
      songs: []
    });

    setInput('');
  }

  function onDelete(id: PlaylistID) {
    deletePlaylist(id);
  }

  return (
    <div>
      <h3>Manage Playlists</h3>
      {playlists.map(playlist => (
        <div key={playlist.id}>
          <span>{playlist.name}</span>
          <span
            style={{
              cursor: 'pointer',
              padding: 5
            }}
            onClick={() => onDelete(playlist.id)}
          >
            X
          </span>
        </div>
      ))}

      <input
        type='text'
        placeholder='Playlist Name'
        value={input}
        onChange={onChange}
      />
      <button onClick={onAdd}>Create Playlist</button>
    </div>
  );
}
