// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import { createHash } from 'crypto';
import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import storage from 'electron-json-storage';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath.path.replace('app.asar', 'app.asar.unpacked'));

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
    let currDuration;

    const stream = ytdl(this.state.link, { quality: 'highestaudio' }).on(
      'info',
      ytinfo => {
        info = ytinfo;
        console.log(info);
      }
    );

    /*
    The info object from ytdl contains a "length_seconds" value,
    but it's only precise to seconds. The progress event from ffmpeg
    has a precision of 0.01s, but doesn't contain total duration information.

    The following calculation uses ytdl's info as an approximate duration
    to calculate percent downloaded. Then, it uses the last duration from
    ffmpeg's progress to store as song duration metadata.
    */

    ffmpeg(stream)
      .audioBitrate(128)
      .save(dlPath)
      .on('progress', progress => {
        console.log(progress);
        const [h, m, s] = progress.timemark.split(':').map(Number);
        currDuration = h * 3600 + m * 60 + s;
        this.setState({
          progress: Math.min(100 * (currDuration / info.length_seconds), 100)
        });
      })
      .on('end', () => {
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
              duration: currDuration,
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
