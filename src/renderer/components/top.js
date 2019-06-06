// @flow strict

import * as React from 'react';
import { render } from 'react-dom';
import { connect } from 'react-redux';

import Sidebar from './sidebar';
import Screen from './screen';
import Youtube from './youtube';
import Settings from './settings';

import type { StoreState, Song } from '../types';

type Props = {|
  +currSong: ?Song,
  +currScreen: ?string
|};

class Top extends React.Component<Props> {
  render() {
    const { currSong, currScreen } = this.props;

    const screens = [
      { key: 'settings', Container: Settings },
      { key: 'youtube', Container: Youtube }
    ];

    return (
      <div className='top'>
        <Sidebar />
        <div
          className={'screen ' + (currScreen === 'settings' ? '' : 'hidden')}
        >
          <Settings />
        </div>

        <div
          className={
            'screen ' +
            (currScreen && currScreen.startsWith('yt-') ? '' : 'hidden')
          }
        >
          <Youtube key={currSong ? currSong.id : null} />
        </div>

        <div
          className={
            'screen ' +
            (currScreen === 'settings' || (currScreen || '').startsWith('yt-')
              ? 'hidden'
              : '')
          }
        >
          <Screen />
        </div>
      </div>
    );
  }
}

function mapState(state: StoreState) {
  return {
    currSong: state.currSong,
    currScreen: state.currScreen
  };
}

const ConnectedComp: React.ComponentType<{||}> = connect(mapState)(Top);

export default ConnectedComp;
