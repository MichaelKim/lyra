// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import type { StoreState, Dispatch } from '../types';

type Props = {|
  +playlist?: ?string,
  +selectPlaylist: (name: ?string) => void
|};

class Sidebar extends React.Component<Props> {
  render() {
    return (
      <div className="sidebar">
        <p>Sidebar</p>
        <p onClick={() => this.props.selectPlaylist(null)}>All Songs</p>
        <p>Playlists</p>
        <p onClick={() => this.props.selectPlaylist('Piano')}>Piano</p>
        <p onClick={() => this.props.selectPlaylist('settings')}>Settings</p>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    playlist: state.playlist
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectPlaylist: (name: ?string) =>
      dispatch({ type: 'SELECT_PLAYLIST', name })
  };
}

export default connect(
  mapState,
  mapDispatch
)(Sidebar);
