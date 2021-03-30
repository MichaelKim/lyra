import { useSelector } from '../hooks';
import PlaybackBar from './playback';
import Top from './top';

export default function Root() {
  const loaded = useSelector(state => state.loaded);
  return loaded ? (
    <>
      <Top />
      <PlaybackBar />
    </>
  ) : (
    <p>Loading...</p>
  );
}
