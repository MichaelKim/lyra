// @flow strict

import * as React from 'react';

import RangeInput from './range';

import { useSelector, useDispatch } from '../../hooks';

import '../../../css/volume.scss';

type PassedProps = {|
  +onChange: (volume: number) => void
|};

export function VolumeBar(props: PassedProps) {
  const [muted, setMuted] = React.useState(false);
  const volume = useSelector(state => state.volume);

  const dispatch = useDispatch();
  const changeVolume = (volume: number) =>
    dispatch({ type: 'CHANGE_VOLUME', volume });

  function onChange(volume: number) {
    props.onChange(volume);
    changeVolume(volume);
  }

  function toggleMute() {
    setMuted(!muted);

    props.onChange(!muted ? 0 : volume);
  }

  React.useEffect(() => props.onChange(volume), []);

  const icon =
    muted || volume === 0
      ? 'volume-none'
      : volume <= 50
      ? 'volume-low'
      : 'volume-high';

  return (
    <>
      <button className={'volume-btn ' + icon} onClick={toggleMute} />
      <div className='volume-bar'>
        <RangeInput
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={onChange}
        />
      </div>
    </>
  );
}

export default VolumeBar;
