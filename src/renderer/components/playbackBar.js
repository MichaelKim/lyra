// @flow strict

import React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';
import path from 'path';
import ReactPlayer from 'react-player';

import type { StoreState, Song } from '../types';

type Props = {|
  +current?: Song
|};

class PlaybackBar extends React.Component<Props> {
  render() {
    const { current } = this.props;

    return (
      <div className="playback-bar">
        <p>Playback</p>
        {current != null ? (
          <audio autoPlay controls src={path.join(current.dir, current.name)} />
        ) : (
          <p>No music playing</p>
        )}
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    current: state.current
  };
}

export default connect(mapState)(PlaybackBar);

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
