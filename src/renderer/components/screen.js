// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import SongItem from './songItem';
import { getSongList, getStatic } from '../util';

import type {
  StoreState,
  Dispatch,
  Song,
  SongID,
  SortType,
  SortColumn
} from '../types';

import '../../css/screen.scss';
import '../../css/song-row.scss';

type Props = {|
  +songs: Song[],
  +currScreen: ?string,
  +sort: SortType,
  +selectSong: (song: Song) => void,
  +setSort: (column: SortColumn, direction: boolean) => void
|};

class Screen extends React.Component<Props> {
  _onClick = (song: Song) => {
    this.props.selectSong(song);
  };

  _onSort = (column: SortColumn) => {
    const { setSort, sort } = this.props;
    if (column === sort.column) {
      setSort(column, !sort.direction);
    } else {
      setSort(column, false);
    }
  };

  render() {
    const { songs, currScreen, sort } = this.props;

    const title = currScreen || 'All Songs';

    const arrow = (
      <img
        src={getStatic(`sort-${sort.direction ? 'up' : 'down'}.svg`)}
        className='sort-icon'
      />
    );

    const columns = [
      { enum: 'TITLE', name: 'Title' },
      { enum: 'ARTIST', name: 'Artist' },
      { enum: 'DURATION', name: 'Duration' },
      { enum: 'DATE', name: 'Date Added' }
    ];

    return (
      <>
        <h1>{title}</h1>
        <div className='song-table'>
          <div className='song-row'>
            <div />
            {columns.map(col => (
              <div
                key={col.enum}
                className='label'
                onClick={() => this._onSort(col.enum)}
              >
                {col.name}
                {sort.column === col.enum ? arrow : null}
              </div>
            ))}
          </div>
          {songs.map(song => (
            <SongItem key={song.id} song={song} />
          ))}
        </div>
      </>
    );
  }
}

function mapState(state: StoreState) {
  return {
    songs: getSongList(state.songs, state.currScreen, state.sort),
    currScreen: state.currScreen,
    sort: state.sort
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song }),
    setSort: (column: SortColumn, direction: boolean) =>
      dispatch({ type: 'SET_SORT', column, direction })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(Screen);

export default ConnectedComp;
