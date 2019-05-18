// @flow strict

import * as React from 'react';
import { render } from 'react-dom';

import RangeInput from './range';

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

  render() {
    return (
      <RangeInput
        min={0}
        max={100}
        value={this.state.volume}
        onChange={this._onChange}
      />
    );
  }
}

export default VolumeBar;
