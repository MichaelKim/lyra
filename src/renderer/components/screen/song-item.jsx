// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import AddModal from './add-modal';
import Click from '../click';
import ContextMenu from '../context';

import { fileExists, formatDuration } from '../../util';

import type {
  StoreState,
  Dispatch,
  Song,
  SongID,
  PlaylistID
} from '../../types';

type PassedProps = {|
  +song: Song
|};

type Props = PassedProps & {|
  +currSongID: ?SongID,
  +selectSong: (song: Song) => void,
  +updateTags: (id: SongID, title: string, artist: string) => void,
  +setPlaylists: (sid: SongID, pids: PlaylistID[]) => void,
  +queueSong: (song: Song) => void,
  +removeSong: (id: SongID) => void
|};

type State = {|
  status: 'LOADING' | 'READY' | 'MISSING' | 'EDITING',
  title: string,
  artist: string,
  editStart: 'TITLE' | 'ARTIST',
  showModal: boolean
|};

class SongItem extends React.Component<Props, State> {
  state = {
    status: 'LOADING',
    title: this.props.song.title,
    artist: this.props.song.artist,
    editStart: 'TITLE',
    showModal: false
  };
  // Focus switching
  _focusTimer: ?TimeoutID = null;

  _onClick = () => {
    this.props.selectSong(this.props.song);
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

    if (
      this.props.song.title !== this.state.title ||
      this.props.song.artist !== this.state.artist
    ) {
      this.props.updateTags(
        this.props.song.id,
        this.state.title,
        this.state.artist
      );
    }
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

  _onModalClose = (playlists: PlaylistID[]) => {
    this.props.setPlaylists(this.props.song.id, playlists);
    this.setState({ showModal: false });
  };

  render() {
    const { status, title, artist } = this.state;

    const isPlaying = this.props.currSongID === this.props.song.id;
    const date = new Date(this.props.song.date).toLocaleDateString();

    return (
      <ContextMenu
        rightClick={true}
        className='context-content'
        items={[
          {
            label: 'Add to Playlist',
            click: () => this.setState({ showModal: true })
          },
          {
            label: 'Add to Queue',
            click: () => this.props.queueSong(this.props.song)
          },
          {
            label: 'Remove Song',
            click: () => this.props.removeSong(this.props.song.id)
          }
        ]}
      >
        <div
          className={'song-row ' + (status === 'MISSING' ? 'song-missing' : '')}
          onFocus={this._onFocus}
          onBlur={this._onBlur}
          onClick={this._onClick}
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
          <div>{date}</div>

          {this.state.showModal && (
            <AddModal song={this.props.song} onClose={this._onModalClose} />
          )}
        </div>
      </ContextMenu>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSongID: state.queue.curr
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    selectSong: (song: Song) => dispatch({ type: 'SELECT_SONG', song }),
    updateTags: (id: SongID, title: string, artist: string) =>
      dispatch({ type: 'UPDATE_TAGS', id, title, artist }),
    setPlaylists: (sid: SongID, pids: PlaylistID[]) =>
      dispatch({ type: 'SET_PLAYLISTS', sid, pids }),
    queueSong: (song: Song) => dispatch({ type: 'QUEUE_SONG', song }),
    removeSong: (id: SongID) => dispatch({ type: 'REMOVE_SONG', id })
  };
}

const ConnectedComp: React.ComponentType<PassedProps> = connect(
  mapState,
  mapDispatch
)(SongItem);

export default ConnectedComp;
