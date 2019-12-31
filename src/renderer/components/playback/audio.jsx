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
  const { src, playing, progress, onProgress, onEnd } = props;

  const volume = useSelector(state =>
    state.volume.muted ? 0 : state.volume.amount
  );

  const audio = React.useRef<?HTMLAudioElement>(null);

  const checkVolume = React.useCallback(() => {
    if (audio.current) {
      audio.current.volume = volume;
    }
  }, [volume]);

  const checkPlaying = React.useCallback(() => {
    if (!audio.current) {
      return;
    }
    if (playing) {
      audio.current.play();
    } else {
      audio.current.pause();
    }
  }, [playing]);

  const checkPosition = React.useCallback(() => {
    if (audio.current && Math.abs(progress - audio.current.currentTime) > 0.2) {
      audio.current.currentTime = progress;
    }
  }, [progress]);

  const ref = React.useCallback(node => {
    audio.current = node;

    checkVolume();
    checkPlaying();
    checkPosition();

    // This callback is only for when the ref is initally set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    checkVolume();
  }, [checkVolume]);

  React.useEffect(() => {
    checkPlaying();
  }, [checkPlaying]);

  React.useEffect(() => {
    checkPosition();
  }, [checkPosition]);

  const _onProgress = (e: SyntheticEvent<HTMLAudioElement>) => {
    onProgress && onProgress(e.currentTarget.currentTime);
  };

  const _onEnd = () => {
    onEnd && onEnd();
  };

  if (src == null) {
    return null;
  }

  return (
    <audio ref={ref} src={src} onTimeUpdate={_onProgress} onEnded={_onEnd} />
  );
};

export default AudioControl;
