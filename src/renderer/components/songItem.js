// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';
import * as mm from 'music-metadata';

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
  status: 'LOADING' | 'READY' | 'MISSING',
  title: string,
  artist: string,
  duration: string
|};

class Screen extends React.Component<Props, State> {
  state = {
    status: 'LOADING',
    title: '',
    artist: '',
    duration: ''
  };

  _onClick = (song: Song) => {
    if (this.state.status === 'READY') {
      this.props.selectSong(song);
    }
  };

  _formatDuration = (duration: number) => {
    const min = (duration / 60) | 0;
    const sec = String(duration % 60 | 0).padStart(2, '0');
    return `${min}:${sec}`;
  };

  componentDidMount() {
    const { song } = this.props;
    const filepath = path.join(song.dir, song.name);

    fileExists(filepath)
      .then(exists => {
        if (!exists) {
          this.setState({
            status: 'MISSING',
            title: this.props.song.name
          });
        } else {
          return mm.parseFile(filepath);
        }
      })
      .then(metadata => {
        this.setState({
          status: 'READY',
          title: metadata.common.title || this.props.song.name,
          artist: metadata.common.artist || '',
          duration: this._formatDuration(metadata.format.duration)
        });
      });
  }

  render() {
    const { song } = this.props;

    return (
      <tr
        className={
          'song-item ' + (this.state.status === 'MISSING' ? 'song-missing' : '')
        }
        onClick={() => this._onClick(song)}
      >
        <td>{this.state.title}</td>
        <td>{this.state.artist}</td>
        <td>{this.state.duration}</td>
      </tr>
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
