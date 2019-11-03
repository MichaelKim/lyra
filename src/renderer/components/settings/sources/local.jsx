// @flow strict

import * as React from 'react';
import path from 'path';
import { connect } from 'react-redux';
import { remote } from 'electron';

import Toggle from '../../toggle';
import { getSongs } from '../../../util';

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
  state = {
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
    const dirs: ?(string[]) = remote.dialog.showOpenDialog({
      properties: ['openDirectory', 'multiSelections']
    });

    if (dirs == null) {
      return;
    }

    const values = await Promise.all(dirs.map(dir => getSongs(dir)));

    // $FlowFixMe: Array.flat() not in Flow
    const songs: Song[] = values.flat();
    const ids = songs.map(song => song.id);
    // Change reduce-spread?
    const toggle = ids.reduce((acc, val) => ({ ...acc, [val]: true }), {});
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
                    .filter(
                      (song: LocalSong) => path.dirname(song.filepath) === dir
                    )
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

const ConnectedComp: React.ComponentType<{||}> = connect(
  null,
  mapDispatch
)(Sources);

export default ConnectedComp;
