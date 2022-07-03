import { clearData } from '../../actions';
import { useDispatch } from '../../hooks';
import Playlists from './playlists';
import Sources from './sources';

export default function Settings() {
  const dispatch = useDispatch();
  const onClick = () => dispatch(clearData());

  return (
    <>
      <h1>Settings</h1>
      <Sources />
      <Playlists />

      <div>
        <button onClick={onClick}>Clear all data</button>
      </div>
    </>
  );
}
