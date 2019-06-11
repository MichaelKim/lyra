// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import { values } from '../../util';

import type { StoreState, Dispatch, Playlist, PlaylistID } from '../../types';

type Props = {|
  +playlists: Playlist[],
  +addPlaylist: (playlist: Playlist) => void,
  +deletePlaylist: (id: PlaylistID) => void
|};

type State = {|
  input: string
|};

class Playlists extends React.Component<Props, State> {
  state = {
    input: ''
  };

  _onChange = (event: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      input: event.target.value
    });
  };

  _onAdd = () => {
    this.props.addPlaylist({
      id: Date.now().toString(),
      name: this.state.input || 'Unnamed Playlist',
      songs: []
    });

    this.setState({
      input: ''
    });
  };

  _onDelete = (id: PlaylistID) => {
    this.props.deletePlaylist(id);
  };

  render() {
    return (
      <div>
        <h3>Manage Playlists</h3>
        {this.props.playlists.map(playlist => (
          <div key={playlist.id}>
            <span>{playlist.name}</span>
            <span
              style={{
                cursor: 'pointer',
                padding: 5
              }}
              onClick={() => this._onDelete(playlist.id)}
            >
              X
            </span>
          </div>
        ))}

        <input
          type='text'
          placeholder='Playlist Name'
          value={this.state.input}
          onChange={this._onChange}
        />
        <button onClick={this._onAdd}>Create Playlist</button>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    playlists: values(state.playlists)
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addPlaylist: (playlist: Playlist) =>
      dispatch({ type: 'CREATE_PLAYLIST', playlist }),
    deletePlaylist: (id: PlaylistID) =>
      dispatch({ type: 'DELETE_PLAYLIST', id })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Playlists);

export default ConnectedComp;
