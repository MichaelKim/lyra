import { Component } from 'react';
import { connect } from 'react-redux';
import { addSongs } from '../../../actions';
import { AppDispatch } from '../../../state/store';
import { LocalSong, Song, SongID, VideoSong } from '../../../types';
import { getSongs, selectLocalDir } from '../../../util';
import Toggle from '../../toggle';

type Props = {
  addSongs: (songs: LocalSong[] | VideoSong[]) => void;
};

type State = {
  selected: boolean;
  tempDirs: string[];
  tempSongs: LocalSong[];
  toggle: Record<SongID, boolean>;
};

class Sources extends Component<Props, State> {
  state: State = {
    selected: false,
    tempDirs: [],
    tempSongs: [],
    toggle: {}
  };

  _onAdd = () => {
    const songs = this.state.tempSongs.filter(
      song => this.state.toggle[song.id]
    );
    this.props.addSongs(songs);
    this.setState({
      selected: false,
      tempDirs: [],
      tempSongs: [],
      toggle: {}
    });
  };

  _onSelect = async () => {
    const result = await selectLocalDir();

    if (result.filePaths.length === 0) {
      return;
    }

    const values = await Promise.all(
      result.filePaths.map(dir => getSongs(dir))
    );

    const songs = values.flat();
    const ids: SongID[] = songs.map(song => song.id);
    const toggle = ids.reduce((acc, val) => {
      acc[val] = true;
      return acc;
    }, {} as Record<SongID, boolean>);
    this.setState({
      selected: true,
      tempDirs: result.filePaths,
      tempSongs: songs,
      toggle
    });
  };

  _onToggle = (songID: SongID) => {
    this.setState(state => {
      const toggle = state.toggle;
      toggle[songID] = !toggle[songID];
      return {
        toggle
      };
    });
  };

  render() {
    return (
      <div className='scroll-box'>
        <div>
          <button onClick={this._onSelect}>Select Directory</button>
        </div>

        {this.state.selected && (
          <>
            {this.state.tempDirs.map(dir => (
              <div key={dir} className='scroll-box'>
                <h5>{dir}</h5>
                <div className='scroll'>
                  {this.state.tempSongs
                    .filter(song => song.filepath.startsWith(dir))
                    .map(song => (
                      <div className='sources-song-item' key={song.id}>
                        <span className='sources-song-name'>{song.title}</span>
                        <Toggle
                          onToggle={() => this._onToggle(song.id)}
                          selected={this.state.toggle[song.id]}
                        />
                      </div>
                    ))}
                </div>
              </div>
            ))}

            <div>
              <button onClick={this._onAdd}>Import</button>
            </div>
          </>
        )}
      </div>
    );
  }
}

function mapDispatch(dispatch: AppDispatch) {
  return {
    addSongs: (songs: Song[]) => dispatch(addSongs(songs))
  };
}

// @ts-expect-error: connect issue
export default connect(null, mapDispatch)(Sources);
