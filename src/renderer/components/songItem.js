// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';

import { fileExists } from '../util';
import Sidebar from './sidebar';

import type { StoreState, Dispatch, Song } from '../types';

import '../../css/screen.css';

type PassedProps = {|
  +song: Song
|};

type Props = PassedProps & {|
  +selectSong: (song: Song) => void
|};

type State = {|
  exists: boolean
|};

class Screen extends React.Component<Props, State> {
  state = {
    exists: true
  };

  _onClick = (song: Song) => {
    if (this.state.exists) {
      this.props.selectSong(song);
    }
  };

  componentDidMount() {
    const { song } = this.props;

    fileExists(path.join(song.dir, song.name)).then(exists =>
      this.setState({
        exists
      })
    );
  }

  render() {
    const { song } = this.props;

    return (
      <div
        className={'song-item ' + (!this.state.exists ? 'song-missing' : '')}
        onClick={() => this._onClick(song)}
      >
        <p>{song.name}</p>
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  null,
  mapDispatch
)(Screen);

export default ConnectedComp;
