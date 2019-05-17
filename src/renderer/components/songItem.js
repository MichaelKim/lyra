// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';
import * as mm from 'music-metadata';
import id3 from 'node-id3';

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
  status: 'LOADING' | 'READY' | 'MISSING' | 'EDITING',
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
  _isDblClick: boolean = false;
  _clickTimer: ?TimeoutID = null;

  _onClick = () => {
    console.log('click');
    // Don't fire click handler if double click
    this._clickTimer = setTimeout(() => {
      if (!this._isDblClick && this.state.status === 'READY') {
        this.props.selectSong(this.props.song);
      }
      this._isDblClick = false;
    }, 250);
  };

  _onDblClick = () => {
    console.log('dblclick');
    // Don't fire single click handler
    clearTimeout(this._clickTimer);
    this._isDblClick = true;

    this.setState({
      status: 'EDITING'
    });
  };

  _onFocusOut = e => {
    console.log('blur');
    const { song } = this.props;
    const filepath = path.join(song.dir, song.name);

    // Change metadata
    const tags = {
      title: this.state.title,
      artist: this.state.artist
    };

    id3.update(tags, filepath, (err, buff) => {
      console.log('done', err, buff);
    });

    this.setState({
      status: 'READY'
    });
  };

  _changeTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  _changeArtist = e => {
    this.setState({
      artist: e.target.value
    });
  };

  _formatDuration = (duration: number) => {
    const min = (duration / 60) | 0;
    const sec = String(duration % 60 | 0).padStart(2, '0');
    return `${min}:${sec}`;
  };

  componentDidMount() {
    const { song } = this.props;
    const filepath = path.join(song.dir, song.name);

    fileExists(filepath).then(exists => {
      if (!exists) {
        this.setState({
          status: 'MISSING',
          title: this.props.song.name
        });
      } else {
        // id3.read(filepath, (err, tags) => {
        //   console.log({
        //     title: tags.title || this.props.song.name,
        //     artist: tags.artist || '',
        //     duration: tags.length || ''
        //   });
        // });

        mm.parseFile(filepath).then(metadata => {
          this.setState({
            status: 'READY',
            title: metadata.common.title || this.props.song.name,
            artist: metadata.common.artist || '',
            duration: this._formatDuration(metadata.format.duration)
          });
        });
      }
    });
  }

  render() {
    const { status, title, artist, duration } = this.state;

    return (
      <tr
        className={'song-item ' + (status === 'MISSING' ? 'song-missing' : '')}
        onClick={this._onClick}
        onDoubleClick={this._onDblClick}
        onFocus={() => console.log('focus')}
        onBlur={this._onFocusOut}
      >
        <td>
          {status === 'EDITING' ? (
            <input type='text' value={title} onChange={this._changeTitle} />
          ) : (
            title
          )}
        </td>
        <td>
          {status === 'EDITING' ? (
            <input type='text' value={artist} onChange={this._changeArtist} />
          ) : (
            artist
          )}
        </td>
        <td>{duration}</td>
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
