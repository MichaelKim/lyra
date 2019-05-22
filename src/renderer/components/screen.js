// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import SongItem from './songItem';
import { values } from '../util';

import type { StoreState, Dispatch, Song, SongID } from '../types';

import '../../css/screen.scss';
import '../../css/song-row.scss';

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
      <div className='screen'>
        <h1>{title}</h1>
        <div className='song-table'>
          <div className='song-row'>
            <div className='label'>Title</div>
            <div className='label'>Artist</div>
            <div className='label'>Duration</div>
            <div className='label'>Date Added</div>
          </div>
          {filtered.map(song => (
            <SongItem key={song.id} song={song} />
          ))}
        </div>
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
