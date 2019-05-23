// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import storage from 'electron-json-storage';

import { setTags } from '../../../util';

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

    const dlPath = path.join(storage.getDataPath(), 'download.mp3');

    let info;

    ytdl(this.state.link, { quality: 'highestaudio' })
      .on('info', ytinfo => {
        info = ytinfo;
        console.log(info);
      })
      .on('response', res => {
        // console.log(res);
      })
      .on('progress', (chunkLen, totalDl, total) => {
        this.setState({
          progress: 0 | ((totalDl / total) * 100)
        });
      })
      .pipe(fs.createWriteStream(dlPath))
      .on('finish', () => {
        console.log('Done downloading!');

        setTags(dlPath, {
          title: info.title,
          artist: info.author.name
        }).then(() => {
          // Sanitize for file name
          const safeName =
            info.title.replace(/[\/\\\?%\*:|"<>. ]/g, '_') + '.mp3';
          fs.rename(dlPath, path.join(storage.getDataPath(), safeName), err => {
            const song = {
              id: createHash('sha256')
                .update(info.video_id)
                .digest('hex'),
              name: safeName,
              title: info.title,
              artist: info.author.title,
              duration: 0,
              dir: storage.getDataPath(),
              playlists: [],
              date: Date.now()
            };
            this.props.addSongs([song]);
            this.setState({
              loading: false
            });
          });
        });
      });
  };

  render() {
    return (
      <div>
        <button onClick={this._onAdd}>Add Link</button>
        <input
          type='text'
          placeholder='Youtube URL'
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
