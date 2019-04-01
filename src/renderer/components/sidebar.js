// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import { values } from '../util';

import type { StoreState, Dispatch, Playlist } from '../types';

import '../../css/sidebar.css';

type Props = {|
  +currScreen?: ?string,
  +playlists: Playlist[],
  +selectPlaylist: (name: ?string) => void
|};

class Sidebar extends React.Component<Props> {
  render() {
    const { currScreen, playlists, selectPlaylist } = this.props;

    return (
      <div className="sidebar">
        <h3 className="sidebar-title">Music Player</h3>
        <p
          className={
            'sidebar-link sidebar-section ' +
            (currScreen == null ? ' sidebar-selected' : '')
          }
          onClick={() => selectPlaylist(null)}
        >
          All Songs
        </p>
        <p className="sidebar-section">Playlists</p>
        {playlists.map(playlist => (
          <p
            key={playlist.id}
            className={
              'sidebar-link ' +
              (currScreen == playlist.name ? ' sidebar-selected' : '')
            }
            onClick={() => selectPlaylist(playlist.name)}
          >
            {playlist.name}
          </p>
        ))}
        <p
          className={
            'sidebar-link sidebar-section ' +
            (currScreen == 'settings' ? ' sidebar-selected' : '')
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
    currScreen: state.currScreen,
    playlists: values(state.playlists)
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectPlaylist: (name: ?string) =>
      dispatch({ type: 'SELECT_PLAYLIST', name })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Sidebar);

export default ConnectedComp;
