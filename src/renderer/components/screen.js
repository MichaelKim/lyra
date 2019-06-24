// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import SongItem from './songItem';
import Search from './search';
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
  +title: string,
  +sort: SortType,
  +selectSong: (song: Song) => void,
  +setSort: (column: SortColumn, direction: boolean) => void
|};

type State = {|
  +search: string
|};

class Screen extends React.Component<Props, State> {
  state = {
    search: ''
  };

  _onSort = (column: SortColumn) => {
    const { setSort, sort } = this.props;
    if (column === sort.column) {
      setSort(column, !sort.direction);
    } else {
      setSort(column, false);
    }
  };

  _onSearch = (value: string) => {
    this.setState({
      search: value.toUpperCase()
    });
  };

  render() {
    const { songs, title, sort } = this.props;

    const arrow = (
      <img
        src={getStatic(`sort-${sort.direction ? 'up' : 'down'}.svg`)}
        className={`sort-icon-${sort.direction ? 'up' : 'down'}`}
      />
    );

    const columns = [
      { enum: 'TITLE', name: 'Title' },
      { enum: 'ARTIST', name: 'Artist' },
      { enum: 'DURATION', name: 'Duration' },
      { enum: 'DATE', name: 'Date Added' }
    ];

    const filtered = this.state.search
      ? songs.filter(song =>
          song.title.toUpperCase().includes(this.state.search)
        )
      : songs;

    return (
      <>
        <h1>{title}</h1>
        <div>
          <Search onChange={this._onSearch} />
        </div>
        <div className='song-row-header'>
          <div className='song-row'>
            <div />
            {columns.map(col => (
              <div
                key={col.enum}
                className='label'
                onClick={() => this._onSort(col.enum)}
              >
                {col.name}
                {sort.column === col.enum && arrow}
              </div>
            ))}
          </div>
        </div>
        <div className='song-table'>
          {filtered.map(song => (
            <SongItem key={song.id} song={song} />
          ))}
        </div>
      </>
    );
  }
}

function mapState(state: StoreState) {
  const { currScreen } = state;
  let title = 'All Songs';
  if (
    !(
      currScreen == null ||
      currScreen === 'settings' ||
      currScreen.startsWith('yt-')
    )
  ) {
    title = state.playlists[currScreen].name;
  }

  return {
    songs: getSongList(state.songs, state.currScreen, state.sort),
    title,
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
