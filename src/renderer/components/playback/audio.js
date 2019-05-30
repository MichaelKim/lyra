// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import path from 'path';
import ytdl from 'ytdl-core';

import type { Song } from '../../types';

type Props = {|
  +currSong: ?Song,
  +onTimeUpdate: (e: SyntheticEvent<HTMLAudioElement>) => void,
  +onEnded: () => void,
  +currentTime: number,
  +volume: number,
  +playing: boolean
|};

type State = {| +src: string, loaded: boolean |};

class Audio extends React.Component<Props, State> {
  state = {
    src: '',
    loaded: false
  };
  _audio = React.createRef<HTMLAudioElement>();

  componentDidMount() {
    const { currSong } = this.props;

    if (currSong == null) {
      return;
    }

    if (currSong.dir === 'youtube') {
      ytdl.getInfo(currSong.id).then(info => {
        const format = ytdl.chooseFormat(info.formats, {
          quality: 'highestaudio'
        });

        this.setState({
          src: format.url,
          loaded: true
        });
      });
    } else {
      this.setState({
        src: path.join('file://', currSong.dir, currSong.name),
        loaded: true
      });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!this._audio.current) {
      return;
    }

    if (prevProps.currentTime !== this.props.currentTime) {
      console.log(prevProps, this.props);
      // this._audio.current.currentTime = this.props.currentTime;
    }

    if (prevProps.volume !== this.props.volume) {
      this._audio.current.volume = this.props.volume;
    }

    if (prevProps.playing !== this.props.playing) {
      if (this.props.playing) {
        this._audio.current.play();
      } else {
        this._audio.current.pause();
      }
    }
  }

  render() {
    return (
      <audio
        ref={this._audio}
        src={this.state.src}
        autoPlay
        onTimeUpdate={this.props.onTimeUpdate}
        onEnded={this.props.onEnded}
      />
    );
  }
}

export default Audio;
