// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import RangeInput from './range';

import type { StoreState, Dispatch } from '../../types';

import '../../../css/volume.scss';

type PassedProps = {|
  +onChange: (volume: number) => void
|};

type Props = PassedProps & {|
  +volume: number,
  +changeVolume: (volume: number) => void
|};

type State = {|
  +muted: boolean
|};

class VolumeBar extends React.Component<Props, State> {
  state = {
    muted: false
  };

  _onChange = (volume: number) => {
    this.props.onChange(volume);
    this.props.changeVolume(volume);
  };

  _toggleMute = () => {
    this.setState(prevState => ({
      muted: !prevState.muted
    }));

    this.props.onChange(!this.state.muted ? 0 : this.props.volume);
  };

  render() {
    const { volume } = this.props;
    const { muted } = this.state;

    const icon =
      muted || volume === 0
        ? 'volume-none'
        : volume <= 50
        ? 'volume-low'
        : 'volume-high';

    return (
      <div className='volume'>
        <button className={'volume-btn ' + icon} onClick={this._toggleMute} />
        <div className='volume-bar'>
          <RangeInput
            min={0}
            max={100}
            value={muted ? 0 : volume}
            onChange={this._onChange}
          />
        </div>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    volume: state.volume
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    changeVolume: (volume: number) =>
      dispatch({ type: 'CHANGE_VOLUME', volume })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  mapState,
  mapDispatch
)(VolumeBar);

export default ConnectedComp;
