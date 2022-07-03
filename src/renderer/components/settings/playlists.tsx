import { useState } from 'react';
import { createPlaylist, deletePlaylist } from '../../actions';
import { useDispatch, useSelector } from '../../hooks';
import { PlaylistID } from '../../types';

export default function Playlists() {
  const playlists = useSelector(state => Object.values(state.playlists));

  const dispatch = useDispatch();

  const [input, setInput] = useState('');

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInput(event.target.value);
  }

  function onAdd() {
    dispatch(
      createPlaylist({
        id: Date.now().toString(),
        name: input || 'Unnamed Playlist',
        songs: []
      })
    );

    setInput('');
  }

  function onDelete(id: PlaylistID) {
    dispatch(deletePlaylist(id));
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
