// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import fs from 'fs';
import path from 'path';

import Sidebar from './sidebar';

import type { StoreState, Dispatch, Song } from '../types';

import '../../css/screen.css';

type Props = {|
  +songs: Song[],
  +playlist: ?string,
  +selectSong: (song: Song) => void
|};

class Screen extends React.Component<Props> {
  _onClick = (song: Song) => {
    this.props.selectSong(song);
  };

  render() {
    const { songs, playlist } = this.props;

    const title = playlist || 'All Songs';

    const filtered =
      playlist == null
        ? songs
        : songs.filter(song => song.name.includes(playlist));

    return (
      <div className="screen">
        <h1>{title}</h1>
        {filtered.map(song => (
          <div
            className="song-item"
            onClick={() => this._onClick(song)}
            key={song.name}
          >
            <p>{song.name}</p>
          </div>
        ))}
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    songs: state.songs,
    playlist: state.playlist
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song })
  };
}

export default connect(
  mapState,
  mapDispatch
)(Screen);
