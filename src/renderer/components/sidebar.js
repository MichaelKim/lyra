// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import { values } from '../util';

import type { StoreState, Dispatch, Playlist, PlaylistID } from '../types';

import '../../css/sidebar.scss';

type Props = {|
  +currScreen?: ?string,
  +playlists: Playlist[],
  +createPlaylist: (playlist: Playlist) => void,
  +selectPlaylist: (id: ?string) => void,
  +deletePlaylist: (id: PlaylistID) => void
|};

type State = {|
  editing: boolean,
  value: string
|};

class Sidebar extends React.Component<Props, State> {
  state = {
    editing: false,
    value: ''
  };

  _renderItem(
    key: ?string,
    name: string,
    selected: boolean,
    deletable: boolean = false
  ) {
    const { currScreen, selectPlaylist } = this.props;

    return (
      <div
        key={key}
        className={
          'sidebar-link sidebar-section ' +
          (selected ? ' sidebar-selected' : '') +
          (deletable ? ' sidebar-del' : '')
        }
      >
        <p onClick={() => selectPlaylist(key)}>{name}</p>
        <button className='del-btn' onClick={() => this._deletePlaylist(key)} />
      </div>
    );
  }

  _addPlaylist = () => {
    this.setState({
      editing: true,
      value: ''
    });
  };

  _deletePlaylist = (id: ?string) => {
    if (!id) return;

    this.props.deletePlaylist(id);
  };

  _finishEdit = () => {
    this.setState({
      editing: false
    });

    // Don't create if empty name
    if (this.state.value) {
      this.props.createPlaylist({
        id: Date.now().toString(),
        name: this.state.value,
        songs: []
      });
    }
  };

  _onChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      value: e.target.value
    });
  };

  _onKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this._finishEdit();
    }
  };

  _onBlur = () => {
    // Don't create if clicking elsewhere
    this.setState({
      editing: false
    });
  };

  render() {
    const { currScreen, playlists, selectPlaylist } = this.props;

    const items = [
      { name: 'All Songs', enum: null },
      { name: 'Settings', enum: 'settings' }
    ];

    return (
      <div className='sidebar'>
        <h3 className='sidebar-title'>Lyra Player</h3>

        <div className='sidebar-section'>
          <p className='label'>Library</p>
        </div>
        {items.map(item =>
          this._renderItem(item.enum, item.name, currScreen == item.enum)
        )}

        <div className='sidebar-section'>
          <p className='label'>YouTube</p>
        </div>
        {this._renderItem('yt-search', 'Search', currScreen === 'yt-search')}
        {this._renderItem('yt-playing', 'Playing', currScreen === 'yt-playing')}

        <div className='sidebar-section'>
          <p className='label'>Playlists</p>
          <button className='add-btn' onClick={this._addPlaylist} />
        </div>
        {this.state.editing ? (
          <input
            autoFocus
            type='text'
            placeholder='Playlist Name'
            value={this.state.value}
            onChange={this._onChange}
            onKeyDown={this._onKeyDown}
            onBlur={this._onBlur}
          />
        ) : null}
        {playlists.map(playlist =>
          this._renderItem(
            playlist.id,
            playlist.name,
            currScreen === playlist.name,
            true
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
    createPlaylist: (playlist: Playlist) =>
      dispatch({ type: 'CREATE_PLAYLIST', playlist }),
    selectPlaylist: (id: ?string) => dispatch({ type: 'SELECT_PLAYLIST', id }),
    deletePlaylist: (id: PlaylistID) =>
      dispatch({ type: 'DELETE_PLAYLIST', id })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Sidebar);

export default ConnectedComp;
