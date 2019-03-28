// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import fs from 'fs';
import path from 'path';

import Sidebar from './sidebar';

import type { StoreState, Dispatch, Song } from '../types';

type Props = {|
  +directories: string[],
  +playlist: ?string,
  +selectSong: (song: Song) => void
|};

type State = {
  loaded: boolean,
  songs: Song[]
};

class Screen extends React.Component<Props, State> {
  state = {
    loaded: false,
    songs: []
  };

  componentDidMount() {
    const promises = this.props.directories.map(
      dir =>
        new Promise((resolve, reject) => {
          fs.readdir(dir, (err, files) => {
            if (err) reject();
            else {
              const names = files.filter(file => path.extname(file) === '.mp3');
              resolve(
                names.map(name => ({
                  name,
                  dir
                }))
              );
            }
          });
        })
    );

    Promise.all(promises).then(values => {
      this.setState({
        loaded: true,
        // $FlowFixMe: Array.prototype.flat not in Flow
        songs: values.flat()
      });
    });
  }

  _onClick = (song: Song) => {
    this.props.selectSong(song);
  };

  render() {
    const { playlist } = this.props;
    const { songs, loaded } = this.state;

    const title = playlist || 'All Songs';

    const filtered =
      playlist == null
        ? songs
        : songs.filter(song => song.name.includes(playlist));

    return (
      <div className="screen">
        <h1>{title}</h1>
        {loaded ? (
          <div>
            {filtered.map(song => (
              <div onClick={() => this._onClick(song)} key={song.name}>
                <p>{song.name}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    directories: state.directories,
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
