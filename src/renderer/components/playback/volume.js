// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import '../../../css/volume.css';

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

  _onChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    const volume = Number(e.currentTarget.value);

    this.setState({
      volume
    });

    this.props.onChange(volume);
  };

  render() {
    return (
      <input
        className='volume-bar'
        type='range'
        min='0'
        max='100'
        value={this.state.volume}
        onChange={this._onChange}
        style={{
          backgroundImage: `linear-gradient(to right, black ${
            this.state.volume
          }%, gray ${this.state.volume}%)`
        }}
      />
    );
  }
}

export default VolumeBar;
