// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';
import path from 'path';
import { remote } from 'electron';

import { fileExists, formatDuration, showContextMenu } from '../util';
import Sidebar from './sidebar';
import Click from './click';

import type { StoreState, Dispatch, Song, SongID } from '../types';

type PassedProps = {|
  +song: Song
|};

type Props = PassedProps & {|
  +currSong: ?Song,
  +selectSong: (song: Song) => void,
  +updateTags: (id: SongID, title: string, artist: string) => void
|};

type State = {|
  status: 'LOADING' | 'READY' | 'MISSING' | 'EDITING',
  title: string,
  artist: string,
  editStart: 'TITLE' | 'ARTIST'
|};

class SongItem extends React.Component<Props, State> {
  state = {
    status: 'LOADING',
    title: this.props.song.title,
    artist: this.props.song.artist,
    editStart: 'TITLE'
  };
  // Focus switching
  _focusTimer: ?TimeoutID = null;

  _onClick = () => {
    this.props.selectSong(this.props.song);
  };

  _onContextMenu = () => {
    showContextMenu([
      {
        label: 'Add to Playlist',
        click: () => {
          console.log(remote.require('../../main/window'));
          // const win = new remote.BrowserWindow({
          //   parent: remote.getCurrentWindow(),
          //   modal: true
          // });

          // win.loadURL('http://google.com');
        }
      }
    ]);
  };

  _onDblClick = editStart => {
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
    // Change metadata
    this.setState({
      status: 'READY'
    });

    this.props.updateTags(
      this.props.song.id,
      this.state.title,
      this.state.artist
    );
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

  async componentDidMount() {
    const { song } = this.props;
    // Youtube sources don't require a file check
    if (song.source === 'YOUTUBE' || (await fileExists(song.filepath))) {
      this.setState({
        status: 'READY'
      });
    } else {
      this.setState({
        status: 'MISSING'
      });
    }
  }

  _renderInput = (name, value: string, onChange) => {
    const { status, editStart } = this.state;

    return (
      <Click
        className={status === 'EDITING' ? 'song-row-edit' : ''}
        onDblClick={() => this._onDblClick(name)}
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
      </Click>
    );
  };

  render() {
    const { status, title, artist } = this.state;

    const isPlaying =
      this.props.currSong != null &&
      this.props.currSong.id === this.props.song.id;

    return (
      <div
        className={'song-row ' + (status === 'MISSING' ? 'song-missing' : '')}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onClick={this._onClick}
        onContextMenu={this._onContextMenu}
      >
        <div className='is-playing'>
          {isPlaying ? (
            <>
              <div />
              <div />
              <div />
            </>
          ) : null}
        </div>
        {this._renderInput('TITLE', title, this._changeTitle)}
        {this._renderInput('ARTIST', artist, this._changeArtist)}
        <div>{formatDuration(this.props.song.duration)}</div>
        <div>{new Date(this.props.song.date).toLocaleDateString()}</div>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSong: state.currSong
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song }),
    updateTags: (id: SongID, title: string, artist: string) =>
      dispatch({ type: 'UPDATE_TAGS', id, title, artist })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  mapState,
  mapDispatch
)(SongItem);

export default ConnectedComp;
