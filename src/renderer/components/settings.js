// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import fs from 'fs';
import path from 'path';
import { remote } from 'electron';
import { getSongs } from '../util';

import type { StoreState, Dispatch, Song } from '../types';

type Props = {|
  +addSongs: (songs: Song[]) => void,
  +clearData: () => void
|};

type State = {|
  selected: boolean,
  tempDirs: [],
  tempSongs: Song[]
|};

class Settings extends React.Component<Props, State> {
  state = {
    selected: false,
    tempDirs: [],
    tempSongs: []
  };

  _onAdd = () => {
    this.props.addSongs(this.state.tempSongs);
  };

  _onSelect = () => {
    const dirs = remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    });

    if (dirs == null) {
      return;
    }

    const promises = dirs.map(dir => getSongs(dir));

    Promise.all(promises).then(values => {
      this.setState({
        selected: true,
        tempDirs: dirs,
        tempSongs: values.flat()
      });
    });
  };

  _onClear = () => {
    this.props.clearData();
  };

  render() {
    return (
      <div className="screen">
        <h1>Settings</h1>
        <h3>Add Songs</h3>
        <button onClick={this._onSelect}>Select Directory</button>

        {this.state.selected ? (
          <>
            {this.state.tempSongs.map(song => (
              <p key={song.name}>{song.name}</p>
            ))}

            <button onClick={this._onAdd}>Import</button>
          </>
        ) : null}

        <button onClick={this._onClear}>Clear all data</button>
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addSongs: (songs: Song[]) => dispatch({ type: 'ADD_SONGS', songs }),
    clearData: () => dispatch({ type: 'CLEAR_DATA' })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  null,
  mapDispatch
)(Settings);

export default ConnectedComp;
