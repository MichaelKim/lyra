// @flow strict

import * as React from 'react';

import { useSelector } from '../../hooks';

type Props = {|
  +src: ?string,
  +playing: boolean,
  +progress: number,
  +onProgress?: (progress: number) => mixed,
  +onEnd?: () => mixed
|};

const AudioControl = (props: Props) => {
  const audio = React.useRef<?HTMLAudioElement>(null);
  const { src, playing, progress, onProgress, onEnd } = props;
  const volume = useSelector(state =>
    state.volume.muted ? 0 : state.volume.amount
  );

  const _onProgress = (e: SyntheticEvent<HTMLAudioElement>) => {
    onProgress && onProgress(e.currentTarget.currentTime);
  };

  const _onEnd = () => {
    onEnd && onEnd();
  };

  React.useEffect(() => {
    if (playing) {
      audio.current && audio.current.play();
    } else {
      audio.current && audio.current.pause();
    }
  }, [playing]);

  React.useEffect(() => {
    // _tempVol?
    if (audio.current != null) {
      audio.current.volume = volume;
    }
  }, [volume]);

  React.useEffect(() => {
    if (
      audio.current != null &&
      Math.abs(progress - audio.current.currentTime) > 0.2
    ) {
      audio.current.currentTime = progress;
    }
  }, [progress]);

  if (src == null) {
    return null;
  }

  return (
    <audio
      ref={audio}
      src={src}
      autoPlay
      onTimeUpdate={_onProgress}
      onEnded={_onEnd}
    />
  );
};

export default AudioControl;
