// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';

import { fileExists, getMetadata, setTags } from '../util';
import Sidebar from './sidebar';

import type { StoreState, Dispatch, Song } from '../types';

import '../../css/table.css';

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
  duration: string,
  editStart: 'TITLE' | 'ARTIST'
|};

class Screen extends React.Component<Props, State> {
  state = {
    status: 'LOADING',
    title: '',
    artist: '',
    duration: '',
    editStart: 'TITLE'
  };
  // Double click
  _isDblClick: boolean = false;
  _clickTimer: ?TimeoutID = null;
  // Focus switching
  _focusTimer: ?TimeoutID = null;

  _onClick = editStart => {
    // Make it easier to double click
    if (this._clickTimer != null) {
      this._onDblClick(editStart);
      return;
    }

    // Don't fire click handler if double click
    this._clickTimer = setTimeout(() => {
      if (!this._isDblClick && this.state.status === 'READY') {
        this.props.selectSong(this.props.song);
      }
      this._clickTimer = null;
      this._isDblClick = false;
    }, 250);
  };

  _onDblClick = editStart => {
    // Don't fire single click handler
    this._clickTimer && clearTimeout(this._clickTimer);
    this._clickTimer = null;
    this._isDblClick = true;

    this.setState({
      status: 'EDITING',
      editStart
    });
  };

  _onFocus = () => {
    this._focusTimer && clearTimeout(this._focusTimer);
    this._focusTimer = null;
  };

  _onBlur = () => {
    this._focusTimer = setTimeout(() => {
      this._finishEdit();
      this._focusTimer = null;
    }, 10);
  };

  _onKeyDown = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      this._finishEdit();
    }
  };

  _finishEdit = () => {
    const { song } = this.props;
    const filepath = path.join(song.dir, song.name);

    // Change metadata
    const tags = {
      title: this.state.title,
      artist: this.state.artist
    };

    this.setState({
      status: 'READY'
    });

    setTags(filepath, tags);
  };

  _changeTitle = (e: SyntheticInputEvent<HTMLInputElement>) => {
    this.setState({
      title: e.target.value
    });
  };

  _changeArtist = (e: SyntheticInputEvent<HTMLInputElement>) => {
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
        getMetadata(song).then(metadata => {
          this.setState({
            status: 'READY',
            title: metadata.title,
            artist: metadata.artist,
            duration: this._formatDuration(metadata.duration)
          });
        });
      }
    });
  }

  _renderInput = (name, value: string, onChange) => {
    const { status, title, editStart } = this.state;

    return (
      <div
        className={status === 'EDITING' ? 'song-row-edit' : ''}
        onClick={() => this._onClick(name)}
        onDoubleClick={() => this._onDblClick(name)}
      >
        {status === 'EDITING' ? (
          <input
            autoFocus={editStart === name}
            type='text'
            value={value}
            onChange={onChange}
            onKeyDown={this._onKeyDown}
          />
        ) : (
          value
        )}
      </div>
    );
  };

  render() {
    const { status, title, artist, duration, editStart } = this.state;

    return (
      <div
        className={'song-row ' + (status === 'MISSING' ? 'song-missing' : '')}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
      >
        {this._renderInput('TITLE', title, this._changeTitle)}
        {this._renderInput('ARTIST', artist, this._changeArtist)}
        <div>{duration}</div>
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
