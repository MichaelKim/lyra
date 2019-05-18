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

type State = {| currentTime: number, paused: boolean |};

class PlaybackBar extends React.Component<Props, State> {
  state = {
    currentTime: 0,
    paused: false
  };
  _audio = React.createRef();

  _onVolumeChange = (volume: number) => {
    if (this._audio.current) {
      this._audio.current.volume = volume / 100;
    }
  };

  _onTimeUpdate = e => {
    this.setState({
      currentTime: e.target.currentTime
    });
  };

  _onSeek = (seek: number) => {
    if (this._audio.current) {
      this._audio.current.currentTime = seek;
    }
  };

  _onTogglePause = () => {
    if (this._audio.current) {
      if (this.state.paused) {
        this._audio.current.play();
      } else {
        this._audio.current.pause();
      }
    }

    this.setState(prevState => ({
      paused: !prevState.paused
    }));
  };

  _onEnded = () => {
    this.setState({
      paused: true
    });
  };

  render() {
    const { currSong } = this.props;

    return (
      <div className='playback-box'>
        {currSong != null ? (
          <>
            <audio
              ref={this._audio}
              src={path.join('file://', currSong.dir, currSong.name)}
              autoPlay
              onTimeUpdate={this._onTimeUpdate}
              onEnded={this._onEnded}
            />
            <RangeInput
              className='playback-bar'
              value={this.state.currentTime}
              max={this._audio.current ? this._audio.current.duration : 0}
              onChange={this._onSeek}
            />
          </>
        ) : (
          <input className='playback-bar' type='range' value='0' disabled />
        )}
        <div className='playback-controls'>
          <button onClick={this._onTogglePause} disabled={currSong == null}>
            {this.state.paused ? 'Play' : 'Pause'}
          </button>
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
