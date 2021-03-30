import { useDispatch } from '../../hooks';
import Playlists from './playlists';
import Sources from './sources';

export default function Settings() {
  const dispatch = useDispatch();
  const clearData = () => dispatch({ type: 'CLEAR_DATA' });

  return (
    <>
      <h1>Settings</h1>
      <Sources />
      <Playlists />

      <div>
        <button onClick={clearData}>Clear all data</button>
      </div>
    </>
  );
}
