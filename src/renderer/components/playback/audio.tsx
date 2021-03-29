// @flow strict

import * as React from 'react';
import { connect } from 'react-redux';

import type { StoreState } from '../../types';

type PassedProps = {|
  +src: ?string,
  +playing: boolean,
  +progress: number,
  +onProgress?: (progress: number) => mixed,
  +onEnd?: () => mixed
|};

type Props = PassedProps & {|
  +volume: number
|};

class AudioControl extends React.Component<Props> {
  audio = React.createRef<HTMLAudioElement>();

  checkVolume = () => {
    if (this.audio.current && this.audio.current.volume !== this.props.volume) {
      this.audio.current.volume = this.props.volume;
    }
  };

  checkPlaying = () => {
    if (
      !this.audio.current ||
      this.audio.current.paused !== this.props.playing
    ) {
      return;
    }

    if (this.props.playing) {
      this.audio.current.play();
    } else {
      this.audio.current.pause();
    }
  };

  checkPosition = () => {
    const { progress } = this.props;
    if (
      this.audio.current &&
      Math.abs(progress - this.audio.current.currentTime) > 0.5
    ) {
      this.audio.current.currentTime = progress;
    }
  };

  componentDidMount() {
    this.checkVolume();
    this.checkPlaying();
    this.checkPosition();
  }

  componentDidUpdate() {
    this.checkVolume();
    this.checkPlaying();
    this.checkPosition();
  }

  onProgress = (e: SyntheticEvent<HTMLAudioElement>) => {
    const { onProgress } = this.props;
    onProgress && onProgress(e.currentTarget.currentTime);
  };

  onEnd = () => {
    const { onEnd } = this.props;
    onEnd && onEnd();
  };

  render() {
    const { src } = this.props;

    if (src == null) {
      return null;
    }

    return (
      <audio
        ref={this.audio}
        preload='auto'
        src={src}
        onTimeUpdate={this.onProgress}
        onEnded={this.onEnd}
      />
    );
  }
}

const mapState = (state: StoreState) => {
  return {
    volume: state.volume.muted ? 0 : state.volume.amount
  };
};

export default (connect(mapState)(
  AudioControl
): React.ComponentType<PassedProps>);
