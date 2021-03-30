import '../../../css/volume.scss';
import { useDispatch, useSelector } from '../../hooks';
import RangeInput from './range';

export function VolumeBar() {
  const volume = useSelector(state => state.volume.amount);
  const muted = useSelector(state => state.volume.muted);

  const dispatch = useDispatch();
  const changeVolume = (volume: number) =>
    dispatch({ type: 'CHANGE_VOLUME', volume });
  const toggleMute = () => {
    dispatch({ type: 'MUTE', muted: !muted });
  };

  const onChange = (volume: number) => {
    /*
      This converts the linear slider to a logarithmic scale in order
      to match our perception of loudness.
      This adjustment forms a nice log curve from (0,0.01) to (1,1).
      In order to mute at 0, the volume is dropped to 0, ignoring the log. The 1% dropoff is small enough to be unnoticable.
    */
    const adjusted = volume === 0 ? 0 : Math.pow(100, volume - 1);
    changeVolume(adjusted);
  };

  // The inverse of the above adjustment
  const slider = muted || volume === 0 ? 0 : Math.log10(volume) / 2 + 1;

  const icon =
    slider === 0 ? 'volume-none' : slider <= 0.5 ? 'volume-low' : 'volume-high';

  return (
    <>
      <button className={'volume-btn ' + icon} onClick={toggleMute} />
      <div className='volume-bar'>
        <RangeInput min={0} max={1} value={slider} onChange={onChange} />
      </div>
    </>
  );
}

export default VolumeBar;
