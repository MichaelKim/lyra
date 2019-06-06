// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import { values } from '../util';

import type { StoreState, Dispatch, Playlist } from '../types';

import '../../css/sidebar.scss';

type Props = {|
  +currScreen?: ?string,
  +playlists: Playlist[],
  +selectPlaylist: (name: ?string) => void
|};

class Sidebar extends React.Component<Props> {
  _renderItem(key: ?string, name: string, selected: boolean) {
    const { currScreen, selectPlaylist } = this.props;

    return (
      <p
        key={key}
        className={
          'sidebar-link sidebar-section ' +
          (selected ? ' sidebar-selected' : '')
        }
        onClick={() => selectPlaylist(key)}
      >
        {name}
      </p>
    );
  }

  render() {
    const { currScreen, playlists, selectPlaylist } = this.props;

    const items = [
      { name: 'All Songs', enum: null },
      { name: 'Settings', enum: 'settings' }
    ];

    return (
      <div className='sidebar'>
        <h3 className='sidebar-title'>Music Player</h3>

        <p className='sidebar-section label'>Library</p>
        {items.map(item =>
          this._renderItem(item.enum, item.name, currScreen == item.enum)
        )}

        <p className='sidebar-section label'>YouTube</p>
        {this._renderItem('yt-search', 'Search', currScreen === 'yt-search')}
        {this._renderItem('yt-playing', 'Playing', currScreen === 'yt-playing')}

        <p className='sidebar-section label'>Playlists</p>
        {playlists.map(playlist =>
          this._renderItem(
            playlist.id,
            playlist.name,
            currScreen === playlist.name
          )
        )}
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
