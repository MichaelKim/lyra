// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import Sources from './sources';
import Playlists from './playlists';

import type { Dispatch } from '../../types';

type Props = {|
  +clearData: () => void
|};

class Settings extends React.Component<Props> {
  _onClear = () => {
    this.props.clearData();
  };

  render() {
    return (
      <>
        <h1>Settings</h1>
        <Sources />
        <Playlists />

        <div>
          <button onClick={this._onClear}>Clear all data</button>
        </div>
      </>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    clearData: () => dispatch({ type: 'CLEAR_DATA' })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  null,
  mapDispatch
)(Settings);

export default ConnectedComp;
