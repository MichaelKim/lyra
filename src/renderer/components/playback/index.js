// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';
import { ipcRenderer } from 'electron';
// import ReactPlayer from 'react-player';

import VolumeBar from './volume';
import RangeInput from './range';
import { formatDuration } from '../../util';

import type { StoreState, Song, Dispatch } from '../../types';

import '../../../css/playback.scss';

type Props = {|
  +currSong?: Song,
  +shuffle: boolean,
  +skipPrevious: () => void,
  +skipNext: () => void,
  +setShuffle: (shuffle: boolean) => void
|};

type State = {|
  currentTime: number
|};

class PlaybackBar extends React.Component<Props, State> {
  state = {
    currentTime: 0
  };
  _tempVol = null;
  _audio = React.createRef();

  _onVolumeChange = (volume: number) => {
    if (this._audio.current) {
      this._audio.current.volume = volume / 100;
    } else {
      this._tempVol = volume;
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

  _onReplay = () => {
    // Don't need to max 0
    this._onSeek(this.state.currentTime - 10);
  };

  _onForward = () => {
    // Don't need to min duration
    this._onSeek(this.state.currentTime + 10);
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

    this.props.skipNext();
  };

  _onShuffle = () => {
    this.props.setShuffle(!this.props.shuffle);
  };

  componentDidMount() {
    if (this._tempVol != null) {
      this._onVolumeChange(this._tempVol);
    }

    ipcRenderer.on('play-pause', event => {
      this._onTogglePause();
    });

    ipcRenderer.on('skip-previous', event => {
      this.props.skipPrevious();
    });

    ipcRenderer.on('skip-next', event => {
      this.props.skipNext();
    });
  }

  render() {
    const { currSong } = this.props;
    const max =
      this._audio.current && this._audio.current.duration
        ? this._audio.current.duration
        : 0;

    const currTime = formatDuration(this.state.currentTime);
    const maxTime = formatDuration(max);

    return (
      <div className="playback-box">
        <audio
          ref={this._audio}
          src={
            currSong ? path.join('file://', currSong.dir, currSong.name) : null
          }
          autoPlay
          onTimeUpdate={this._onTimeUpdate}
          onEnded={this._onEnded}
        />
        <div className="playback-bar">
          <p>{currTime}</p>
          {currSong != null ? (
            <RangeInput
              value={this.state.currentTime}
              max={max}
              onChange={this._onSeek}
            />
          ) : (
            <RangeInput value={0} max={0} />
          )}
          <p>{maxTime}</p>
        </div>
        {currSong != null ? (
          <div className="playback-left">
            <h3>{currSong.title}</h3>
            <h5>{currSong.artist}</h5>
          </div>
        ) : null}
        <div className="playback-controls">
          <button className="skip-previous" onClick={this.props.skipPrevious} />
          <button className="replay-btn" onClick={this._onReplay} />
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
          <button className="forward-btn" onClick={this._onForward} />
          <button className="skip-next" onClick={this.props.skipNext} />
        </div>
        <div className="playback-right">
          <button
            className={
              'shuffle-btn ' + (this.props.shuffle ? '' : 'shuffle-off')
            }
            onClick={this._onShuffle}
          />
          <VolumeBar onChange={this._onVolumeChange} />
        </div>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSong: state.currSong,
    shuffle: state.shuffle
  };
}

function mapDispatch(dispatch: Dispatch) {
  return {
    skipPrevious: () => dispatch({ type: 'SKIP_PREVIOUS' }),
    skipNext: () => dispatch({ type: 'SKIP_NEXT' }),
    setShuffle: (shuffle: boolean) => dispatch({ type: 'SET_SHUFFLE', shuffle })
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(
  mapState,
  mapDispatch
)(PlaybackBar);

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
