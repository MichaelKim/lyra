// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { createHash } from 'crypto';
import fs from 'fs';
import ytdl from 'ytdl-core';

import type { StoreState, Dispatch, Song, SongID } from '../../../types';

type Props = {|
  +addSongs: (songs: Song[]) => void
|};

type State = {|
  loading: boolean,
  link: string,
  progress: ?number
|};

class Sources extends React.Component<Props, State> {
  state = {
    loading: false,
    link: '',
    progress: null
  };

  _onChange = (e: SyntheticKeyboardEvent<HTMLInputElement>) => {
    this.setState({
      link: e.currentTarget.value
    });
  };

  _onAdd = () => {
    this.setState({
      loading: true
    });

    let info;

    ytdl(this.state.link, { quality: 'highestaudio' })
      .on('info', ytinfo => {
        info = ytinfo;
      })
      .on('response', res => {
        // console.log(res);
        console.log('Start downloading...');
      })
      .on('progress', (chunkLen, totalDl, total) => {
        this.setState({
          progress: 0 | ((totalDl / total) * 100)
        });
        console.log((((totalDl / total) * 100) | 0) + '%');
      })
      .pipe(fs.createWriteStream('test.mp3'))
      .on('finish', () => {
        console.log('Done downloading!');
        console.log(info);
        // const song = {
        //   id: createHash('sha256')
        //     .update(info.video_id)
        //     .digest('hex'),
        //   name: info.title,
        //   dir: '',
        //   playlists: [],
        //   date: Date.now()
        // };
        this.setState({
          loading: false
        });
        // this.props.addSongs([song]);
      });
  };

  render() {
    return (
      <div>
        <button onClick={this._onAdd}>Add Link</button>
        <input
          type="text"
          placeholder="Youtube URL"
          value={this.state.link}
          onChange={this._onChange}
          disabled={this.state.loading}
        />
        {this.state.loading ? (
          <progress value={this.state.progress} max={100} />
        ) : null}
      </div>
    );
  }
}

function mapDispatch(dispatch: Dispatch) {
  return {
    addSongs: (songs: Song[]) => dispatch({ type: 'ADD_SONGS', songs })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  null,
  mapDispatch
)(Sources);

export default ConnectedComp;
