// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import fs from 'fs';
import path from 'path';

import Sidebar from './sidebar';

import type { StoreState } from '../types';

type Props = {|
  +directory: string,
  +playlist: ?string,
  +selectSong: (name: string) => void
|};

type State = {
  loaded: boolean,
  files: string[]
};

class Screen extends React.Component<Props, State> {
  state = {
    loaded: false,
    files: []
  };

  componentDidMount() {
    fs.readdir(this.props.directory, (err, files) => {
      this.setState({
        loaded: true,
        files: files.filter(file => path.extname(file) === '.mp3')
      });
    });
  }

  _onClick = (file: string) => {
    this.props.selectSong(file);
  };

  render() {
    const { playlist } = this.props;
    const { files, loaded } = this.state;

    const title = playlist || 'All Songs';

    const filtered =
      playlist == null ? files : files.filter(file => file.includes(playlist));

    return (
      <div className="screen">
        <h1>{title}</h1>
        {loaded ? (
          <div>
            {filtered.map(file => (
              <div onClick={() => this._onClick(file)} key={file}>
                <p>{file}</p>
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
    directory: state.directory,
    playlist: state.playlist
  };
}

function mapDispatch(dispatch) {
  return {
    selectSong: (name: string) => dispatch({ type: 'SELECT_SONG', name })
  };
}

export default connect(
  mapState,
  mapDispatch
)(Screen);
