// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import type { StoreState, Dispatch } from '../types';

require('../../css/sidebar.css');

type Props = {|
  +playlist?: ?string,
  +selectPlaylist: (name: ?string) => void
|};

class Sidebar extends React.Component<Props> {
  render() {
    const { playlist, selectPlaylist } = this.props;

    return (
      <div className="sidebar">
        <h3 className="sidebar-title">Music Player</h3>
        <p
          className={
            'sidebar-link sidebar-section ' +
            (playlist == null ? ' sidebar-selected' : '')
          }
          onClick={() => selectPlaylist(null)}
        >
          All Songs
        </p>
        <p className="sidebar-section">Playlists</p>
        <p
          className={
            'sidebar-link ' + (playlist == 'Piano' ? ' sidebar-selected' : '')
          }
          onClick={() => selectPlaylist('Piano')}
        >
          Piano
        </p>
        <p
          className={
            'sidebar-link sidebar-section ' +
            (playlist == 'settings' ? ' sidebar-selected' : '')
          }
          onClick={() => selectPlaylist('settings')}
        >
          Settings
        </p>
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
