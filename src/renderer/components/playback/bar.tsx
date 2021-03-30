import { Song } from '../../types';
import { formatDuration } from '../../util';
import RangeInput from './range';

type Props = {
  currSong: Song | null;
  progress: number;
  onChange: (progress: number) => void;
};

const Bar = (props: Props) => {
  const { currSong, progress, onChange } = props;

  const max = currSong?.duration ?? 0;

  const currTime = formatDuration(progress);
  const maxTime = formatDuration(max);

  return (
    <div className='playback-bar'>
      <p>{currTime}</p>
      {currSong != null ? (
        <RangeInput value={progress} max={max} onChange={onChange} />
      ) : (
        <RangeInput value={0} max={0} />
      )}
      <p>{maxTime}</p>
    </div>
  );
};

export default Bar;
