// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import type { StoreState, Dispatch, Playlist } from '../../types';

type Props = {|
  +playlists: Playlist[],
  +addPlaylist: (playlist: Playlist) => void
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
      id: Date.now(),
      name: this.state.input,
      songs: []
    });

    this.setState({
      input: ''
    });
  };

  render() {
    return (
      <div>
        <h3>Manage Playlists</h3>
        {this.props.playlists.map(playlist => (
          <p key={playlist.id}>{playlist.name}</p>
        ))}

        <input type="text" value={this.state.input} onChange={this._onChange} />
        <button onClick={this._onAdd}>Create Playlist</button>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    playlists: state.playlists
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addPlaylist: (playlist: Playlist) =>
      dispatch({ type: 'CREATE_PLAYLIST', playlist })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Playlists);

export default ConnectedComp;
