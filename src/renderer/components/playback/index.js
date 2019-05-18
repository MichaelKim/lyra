// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';
// import ReactPlayer from 'react-player';

import VolumeBar from './volume';
import RangeInput from './range';

import type { StoreState, Song } from '../../types';

import '../../../css/playback.css';

type Props = {|
  +currSong?: Song
|};

type State = {|
  currentTime: number
|};

class PlaybackBar extends React.Component<Props, State> {
  state = {
    currentTime: 0
  };
  _audio = React.createRef();

  _onVolumeChange = (volume: number) => {
    if (this._audio.current) {
      this._audio.current.volume = volume / 100;
    }
  };

  _onTimeUpdate = (e: SyntheticEvent<HTMLAudioElement>) => {
    this.setState({
      currentTime: e.currentTarget.currentTime
    });
  };

  _onSeek = (seek: number) => {
    if (this._audio.current) {
      this._audio.current.currentTime = seek;
    }
  };

  _onTogglePause = () => {
    if (this._audio.current) {
      if (this._audio.current.paused) {
        this._audio.current.play();
      } else {
        this._audio.current.pause();
      }
    }
  };

  _onEnded = () => {
    this._audio.current && this._audio.current.pause();
  };

  render() {
    const { currSong } = this.props;
    const max =
      this._audio.current && this._audio.current.duration
        ? this._audio.current.duration
        : 0;

    return (
      <div className="playback-box">
        <div className="playback-bar">
          <audio
            ref={this._audio}
            src={
              currSong
                ? path.join('file://', currSong.dir, currSong.name)
                : null
            }
            autoPlay
            onTimeUpdate={this._onTimeUpdate}
            onEnded={this._onEnded}
          />
          {currSong != null ? (
            <RangeInput
              value={this.state.currentTime}
              max={max}
              onChange={this._onSeek}
            />
          ) : (
            <RangeInput value={0} max={0} />
          )}
        </div>
        <div className="playback-controls">
          <button
            className={
              'play-pause ' +
              (this._audio.current == null || this._audio.current.paused
                ? 'play'
                : 'pause')
            }
            onClick={this._onTogglePause}
            disabled={currSong == null}
          />
        </div>
        <VolumeBar onChange={this._onVolumeChange} />
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSong: state.currSong
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(mapState)(PlaybackBar);

export default ConnectedComp;

//   <ReactPlayer
//     // url={'file:///C:/Users/Michael/Music/' + this.state.playing}
//     url={'https://www.youtube.com/watch?v=ikU7C8TMiiw'}
//     // url={
//     //   'file:///C:/Users/Michael/Documents/Github/music-player/video.mp4'
//     // }
//     controls
//     playing
//   />
// ) : null}
// {/* <iframe
//   type="text/html"
//   width="640"
//   height="360"
//   src="https://www.youtube.com/embed/ikU7C8TMiiw?autoplay=1&origin=localhost"
//   frameBorder="0"
// /> */}
// {/* <audio
//   controls
//   src={'file:///C:/Users/Michael/Music/' + this.state.music[0]}
// /> */}
// {/* <video
//   src="file:///C:/Users/Michael/Documents/Github/music-player/video.mp4"
//   controls
// /> */}
