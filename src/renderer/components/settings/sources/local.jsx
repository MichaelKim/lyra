// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import Toggle from '../../toggle';
import { getSongs, selectLocalDir } from '../../../util';

import type {
  Dispatch,
  LocalSong,
  VideoSong,
  Song,
  SongID
} from '../../../types';

type Props = {|
  +addSongs: (songs: LocalSong[] | VideoSong[]) => void
|};

type State = {|
  selected: boolean,
  tempDirs: string[],
  tempSongs: LocalSong[],
  toggle: { [id: SongID]: boolean }
|};

class Sources extends React.Component<Props, State> {
  state: State = {
    selected: false,
    tempDirs: [],
    tempSongs: [],
    toggle: {}
  };

  _onAdd = () => {
    const songs = this.state.tempSongs.filter(
      song => this.state.toggle[song.id]
    );
    this.props.addSongs(songs);
    this.setState({
      selected: false,
      tempDirs: [],
      tempSongs: [],
      toggle: {}
    });
  };

  _onSelect = async () => {
    const dirs = selectLocalDir();

    if (dirs == null) {
      return;
    }

    const values = await Promise.all(dirs.map(dir => getSongs(dir)));

    const songs: LocalSong[] = values.flat();
    const ids: SongID[] = songs.map(song => song.id);
    const toggle = ids.reduce((acc, val) => {
      acc[val] = true;
      return acc;
    }, ({}: $PropertyType<State, 'toggle'>));
    this.setState({
      selected: true,
      tempDirs: dirs,
      tempSongs: songs,
      toggle
    });
  };

  _onToggle = (songID: SongID) => {
    this.setState(state => {
      const toggle = state.toggle;
      toggle[songID] = !toggle[songID];
      return {
        toggle
      };
    });
  };

  render() {
    return (
      <div className='scroll-box'>
        <div>
          <button onClick={this._onSelect}>Select Directory</button>
        </div>

        {this.state.selected && (
          <>
            {this.state.tempDirs.map(dir => (
              <div key={dir} className='scroll-box'>
                <h5>{dir}</h5>
                <div className='scroll'>
                  {this.state.tempSongs
                    .filter(song => song.filepath.startsWith(dir))
                    .map(song => (
                      <div className='sources-song-item' key={song.id}>
                        <span className='sources-song-name'>{song.title}</span>
                        <Toggle
                          onToggle={() => this._onToggle(song.id)}
                          selected={this.state.toggle[song.id]}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div>
              <button onClick={this._onAdd}>Import</button>
            </div>
          </>
        )}
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addSongs: (songs: Song[]) => dispatch({ type: 'ADD_SONGS', songs })
  };
}

export default (connect(null, mapDispatch)(Sources): React.ComponentType<{||}>);
