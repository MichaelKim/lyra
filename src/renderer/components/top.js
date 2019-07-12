// @flow strict

import * as React from 'react';

import Sidebar from './sidebar';
import Screen from './screen';
import Youtube from './youtube';
import Settings from './settings';

import { useSelector } from '../hooks';

export default function Top() {
  const currSong = useSelector(state => state.currSong);
  const currScreen = useSelector(state => state.currScreen);

  return (
    <div className='top'>
      <Sidebar />
      <div className={'screen ' + (currScreen === 'settings' ? '' : 'hidden')}>
        <Settings />
      </div>

      <div
        className={
          'screen ' +
          (currScreen && currScreen.startsWith('yt-') ? '' : 'hidden')
        }
      >
        <Youtube key={currSong && currSong.id} />
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
