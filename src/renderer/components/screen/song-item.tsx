import { Component } from 'react';
import { connect } from 'react-redux';
import { Dispatch, PlaylistID, Song, SongID, StoreState } from '../../types';
import { fileExists, formatDuration } from '../../util';
import Click from '../click';
import ContextMenu from '../context';
import AddModal from './add-modal';
import EditBox from './edit-box';

type PassedProps = {
  song: Song;
};

type Props = PassedProps & {
  currSongID: SongID | null;
  selectSong: (song: Song) => void;
  updateTags: (id: SongID, title: string, artist: string) => void;
  setPlaylists: (sid: SongID, pids: PlaylistID[]) => void;
  queueSong: (song: Song) => void;
  removeSong: (id: SongID) => void;
};

enum EditStart {
  TITLE,
  ARTIST
}

type State = {
  status: 'LOADING' | 'READY' | 'MISSING' | 'EDITING';
  title: string;
  artist: string;
  editStart: EditStart;
  showModal: boolean;
};

class SongItem extends Component<Props, State> {
  state: State = {
    status: 'LOADING',
    title: this.props.song.title,
    artist: this.props.song.artist,
    editStart: EditStart.TITLE,
    showModal: false
  };
  // Focus switching
  _focusTimer: number | null = null;

  _onClick = () => {
    this.props.selectSong(this.props.song);
  };

  _onDblClick = (editStart: EditStart) => {
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
    this._focusTimer = window.setTimeout(() => {
      this._cancelEdit();
      this._focusTimer = null;
    }, 10);
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

  _cancelEdit = () => {
    // Reset metadata
    this.setState({
      status: 'READY',
      title: this.props.song.title,
      artist: this.props.song.artist
    });
  };

  _changeTitle = (title: string) => {
    this.setState({
      title
    });
  };

  _changeArtist = (artist: string) => {
    this.setState({
      artist
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

  _renderInput = (
    name: EditStart,
    value: string,
    onChange: (value: string) => void
  ) => {
    const { status, editStart } = this.state;

    return (
      <Click
        className={status === 'EDITING' ? 'song-row-edit' : ''}
        onSngClick={this._onClick}
        onDblClick={() => this._onDblClick(name)}
      >
        {status === 'EDITING' ? (
          <EditBox
            initialValue={value}
            autoFocus={editStart === name}
            onChange={onChange}
            onEnter={this._finishEdit}
            onCancel={this._cancelEdit}
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
          {this._renderInput(EditStart.TITLE, title, this._changeTitle)}
          {this._renderInput(EditStart.ARTIST, artist, this._changeArtist)}
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

export default connect(mapState, mapDispatch)(SongItem);
