// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import RangeInput from './range';

import '../../../css/volume.scss';

type Props = {|
  +onChange: (volume: number) => void
|};

type State = {|
  +volume: number,
  +muted: boolean
|};

class VolumeBar extends React.Component<Props, State> {
  state = {
    volume: 100,
    muted: false
  };

  _onChange = (volume: number) => {
    this.setState({
      volume
    });

    this.props.onChange(volume);
  };

  _toggleMute = () => {
    this.setState(prevState => ({
      muted: !prevState.muted
    }));

    this.props.onChange(!this.state.muted ? 0 : this.state.volume);
  };

  render() {
    const icon =
      this.state.muted || this.state.volume === 0
        ? 'volume-none'
        : this.state.volume <= 50
        ? 'volume-low'
        : 'volume-high';

    return (
      <div className='volume'>
        <button className={'volume-btn ' + icon} onClick={this._toggleMute} />
        <div className='volume-bar'>
          <RangeInput
            min={0}
            max={100}
            value={this.state.muted ? 0 : this.state.volume}
            onChange={this._onChange}
          />
        </div>
      </div>
    );
  }
}

export default VolumeBar;
