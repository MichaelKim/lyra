// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import Click from './click';
import Modal from './modal';
import Toggle from './toggle';
import { fileExists, formatDuration, showContextMenu, values } from '../util';

import type {
  StoreState,
  Dispatch,
  Song,
  SongID,
  Playlist,
  PlaylistID
} from '../types';

type PassedProps = {|
  +song: Song
|};

type Props = PassedProps & {|
  +currSongID: ?SongID,
  +playlists: Playlist[],
  +selectSong: (song: Song) => void,
  +updateTags: (id: SongID, title: string, artist: string) => void,
  +setPlaylists: (sid: SongID, pids: PlaylistID[]) => void,
  +removeSong: (id: SongID) => void
|};

type State = {|
  status: 'LOADING' | 'READY' | 'MISSING' | 'EDITING',
  title: string,
  artist: string,
  editStart: 'TITLE' | 'ARTIST',
  showModal: boolean,
  toggle: Set<PlaylistID>
|};

class SongItem extends React.Component<Props, State> {
  state = {
    status: 'LOADING',
    title: this.props.song.title,
    artist: this.props.song.artist,
    editStart: 'TITLE',
    showModal: false,
    toggle: new Set(
      this.props.playlists
        .filter(p => this.props.song.playlists.includes(p.id))
        .map(p => p.id)
    )
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
        click: () => this.setState({ showModal: true })
      },
      {
        label: 'Remove Song',
        click: () => this.props.removeSong(this.props.song.id)
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
        onSngClick={this._onClick}
        onDblClick={() => this._onDblClick(name)}
      >
        {status === 'EDITING' ? (
          <input
            autoFocus={editStart === name}
            type='text'
            value={value}
            onClick={(e: SyntheticMouseEvent<HTMLInputElement>) =>
              e.stopPropagation()
            }
            onChange={onChange}
            onKeyDown={this._onKeyDown}
          />
        ) : (
          value
        )}
      </Click>
    );
  };

  _onToggle = (pid: PlaylistID) => {
    this.setState(prevState => {
      const { toggle } = prevState;
      if (toggle.has(pid)) {
        toggle.delete(pid);
      } else {
        toggle.add(pid);
      }

      return {
        toggle
      };
    });
  };

  _onModalClose = () => {
    this.props.setPlaylists(this.props.song.id, [...this.state.toggle]);
    this.setState({ showModal: false });
  };

  render() {
    const { status, title, artist } = this.state;

    const isPlaying = this.props.currSongID === this.props.song.id;

    return (
      <div
        className={'song-row ' + (status === 'MISSING' ? 'song-missing' : '')}
        onFocus={this._onFocus}
        onBlur={this._onBlur}
        onClick={this._onClick}
        onContextMenu={this._onContextMenu}
      >
        <div className='is-playing'>
          {isPlaying && (
            <>
              <div />
              <div />
              <div />
            </>
          )}
        </div>
        {this._renderInput('TITLE', title, this._changeTitle)}
        {this._renderInput('ARTIST', artist, this._changeArtist)}
        <div>{formatDuration(this.props.song.duration)}</div>
        <div>{new Date(this.props.song.date).toLocaleDateString()}</div>

        <Modal
          isOpen={this.state.showModal}
          onClose={this._onModalClose}
          className='modal-content'
        >
          <h3>Select Playlists</h3>
          {this.props.playlists.map(p => (
            <div key={p.id}>
              <p>{p.name}</p>
              <Toggle
                onToggle={() => this._onToggle(p.id)}
                selected={this.state.toggle.has(p.id)}
              />
            </div>
          ))}
        </Modal>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSongID: state.currSongID,
    playlists: values(state.playlists)
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song }),
    updateTags: (id: SongID, title: string, artist: string) =>
      dispatch({ type: 'UPDATE_TAGS', id, title, artist }),
    setPlaylists: (sid: SongID, pids: PlaylistID[]) =>
      dispatch({ type: 'SET_PLAYLISTS', sid, pids }),
    removeSong: (id: SongID) => dispatch({ type: 'REMOVE_SONG', id })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  mapState,
  mapDispatch
)(SongItem);

export default ConnectedComp;
