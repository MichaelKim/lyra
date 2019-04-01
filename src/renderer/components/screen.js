// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import SongItem from './songItem';
import { values } from '../util';

import type { StoreState, Dispatch, Song, SongID } from '../types';

import '../../css/screen.css';

type Props = {|
  +songs: Song[],
  +currScreen: ?string,
  +selectSong: (song: Song) => void
|};

class Screen extends React.Component<Props> {
  _onClick = (song: Song) => {
    this.props.selectSong(song);
  };

  render() {
    const { songs, currScreen } = this.props;

    const title = currScreen || 'All Songs';

    const filtered =
      currScreen == null
        ? songs
        : songs.filter(song => song.name.includes(currScreen));

    return (
      <div className="screen">
        <h1>{title}</h1>
        {filtered.map(song => (
          <SongItem key={song.id} song={song} />
        ))}
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    songs: values(state.songs),
    currScreen: state.currScreen
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Screen);

export default ConnectedComp;
